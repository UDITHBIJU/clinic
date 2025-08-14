import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
	id: string;
	role: "user" | "doctor";
}

export interface AuthRequest extends Request {
	user?: AuthUser;
}

export const authenticate =
	(allowedRoles?: ("user" | "doctor")[]) =>
	(req: AuthRequest, res: Response, next: NextFunction) => {
		const authHeader = req.headers["authorization"];
		if (!authHeader) {
			return res.status(401).json({ message: "No token provided" });
		}

		const token = authHeader.split(" ")[1];
		try {
			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET || "default"
			) as AuthUser;

			if (allowedRoles && !allowedRoles.includes(decoded.role)) {
				return res.status(403).json({ message: "Forbidden: Invalid role" });
			}

			req.user = { id: decoded.id, role: decoded.role };
			next();
		} catch (error) {
			console.error("Authentication error:", error);
			return res.status(401).json({ message: "Invalid token" });
		}
	};
