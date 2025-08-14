import jwt, { SignOptions } from "jsonwebtoken";

const accessSecret = process.env.JWT_SECRET || "JWT_SECRET";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "JWT_REFRESH_SECRET";

if (!accessSecret || !refreshSecret) {
	throw new Error("JWT secrets not defined in environment variables");
}

export const generateAccessToken = (id: string,role: "user" | "doctor" ) => {
	const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
	return jwt.sign({ id,role }, accessSecret, {
		expiresIn,
	} as SignOptions);
};

export const generateRefreshToken = (id: string,role: "user" | "doctor") => {
	const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
	return jwt.sign({ id,role }, refreshSecret, {
		expiresIn,
	} as SignOptions);
};

export const verifyToken = (token: string) => {
	try {
		return jwt.verify(token, accessSecret);
	} catch (error) {
		return null;
	}
};
export const verifyRefreshToken = (token: string) => {
	try {
		return jwt.verify(token, refreshSecret);
	} catch (error) {
		return null;
	}
};
