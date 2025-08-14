import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateOtp } from "../utils/otp.util";
import { redis } from "../config/redis";
import { sendOtpEmail } from "../services/mail.service";
import { generateAccessToken ,generateRefreshToken,verifyRefreshToken} from "../utils/auth.util";
import { User } from "../models/user.model";
import { Doctor } from "../models/doctor.model";

const requestOtp = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}
		const otp = generateOtp();

		const hashedPassword = await bcrypt.hash(password, 10);

		const value = JSON.stringify({
			username,
			email,
			password: hashedPassword,
			otp,
		});

		await redis.set(`otp:${email}`, value, "EX", 300);

		await sendOtpEmail(email, otp);
		res.status(200).json({ message: "OTP sent to mail" });
	} catch (error) {
		console.error("Error in request otp:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const verifyOtp = async (req: Request, res: Response) => {
	const { email, otp } = req.body;
	try {
		const value = await redis.get(`otp:${email}`);
		if (!value) {
			return res.status(400).json({ message: "OTP expired or invalid" });
		}

		const userData = JSON.parse(value);
		if (userData.otp !== otp) {
			return res.status(400).json({ message: "Invalid OTP" });
		}

		const newUser = new User({
			username: userData.username,
			email: userData.email,
			password: userData.password,
		});

		await newUser.save();
		await redis.del(`otp:${email}`);

		const accessToken = generateAccessToken(newUser._id.toString(),"user");
		const refreshToken = generateRefreshToken(newUser._id.toString(),"user");

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 7 * 24 * 60 * 60 * 1000, 
			sameSite: "none",
		});

		res.status(201).json({
			message: "User registered successfully",
			accessToken,
			user: {
				id: newUser._id,
				username: newUser.username,
				email: newUser.email,
			},
		});
	} catch (error) {
		console.error("Error in verify otp:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const userLogin = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		await redis.del(`refresh:user:${user._id}`);

		const accessToken = generateAccessToken(user._id.toString(),"user");
		const refreshToken = generateRefreshToken(user._id.toString(),"user");

        await redis.set(
					`refresh:user:${user._id}`,
					refreshToken,
					"EX",
					7 * 24 * 60 * 60
				);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			sameSite: "none",
		});

		res.status(200).json({
			message: "Login successful",
			accessToken,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
			},
		});
	} catch (error) {
		console.error("Error during login:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const doctorLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;   
    try {
        const doctor = await Doctor.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
    
        const isPasswordValid = await bcrypt.compare(password, doctor.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }       
        await redis.del(`refresh:doctor:${doctor._id}`);
        const accessToken = generateAccessToken(doctor._id.toString(),"doctor");
        const refreshToken = generateRefreshToken(doctor._id.toString(),"doctor");
       
        await redis.set(
					`refresh:doctor:${doctor._id}`,
					refreshToken,
					"EX",
					7 * 24 * 60 * 60
				);
          
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: "none",
        });
        res.status(200).json({
            message: "Login successful",
            accessToken,
            doctor: {
                id: doctor._id,
                username: doctor.username,
                email: doctor.email,
                speciality: doctor.speciality,
            },
        });
    } catch (error) {
        console.error("Error during doctor login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const logout = async (req: Request, res: Response) => {
	const token = req.cookies.refreshToken;
	if (!token) {
		return res.status(401).json({ message: "No refresh token provided" });
	}
	try {
		const payload = verifyRefreshToken(token);

		if (!payload || typeof payload === "string") {
			return res.status(403).json({ message: "Invalid refresh token" });
		}

		const { id, role } = payload;
		await redis.del(`refresh:${role}:${id}`);

		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "none",
		});

		res.status(200).json({ message: "Logout successful" });
	} catch (error) {
		console.error("Error during logout:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

const refreshToken = async (req: Request, res: Response) => {
	const token = req.cookies.refreshToken;
	if (!token) {
		return res.status(401).json({ message: "No refresh token provided" });
	}
	try {
		const payload = verifyRefreshToken(token);

		if (!payload || typeof payload === "string" || !("id" in payload)) {
			return res.status(403).json({ message: "Invalid refresh token" });
		}

		const { id, role } = payload;
		const redisToken = await redis.get(`refresh:${role}:${id}`);

		if (!redisToken || redisToken !== token) {
			return res
				.status(403)
				.json({ message: "Invalid or expired refresh token" });
		}

		const newAccessToken = generateAccessToken(id, role);
		const newRefreshToken = generateRefreshToken(id, role);

        await redis.del(`refresh:${role}:${id}`);
				await redis.set(
					`refresh:${role}:${id}`,
					newRefreshToken,
					"EX",
					7 * 24 * 60 * 60
				);

		res.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			sameSite: "none",
		});
		res.json({
			accessToken: newAccessToken,
		});
	} catch (error) {
		console.error("Error during token refresh:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export { requestOtp, verifyOtp, userLogin,doctorLogin, refreshToken, logout };
