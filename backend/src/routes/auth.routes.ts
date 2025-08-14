import Router from "express";
import {
	requestOtp,
	verifyOtp,
	userLogin,
	refreshToken,
	logout,
    doctorLogin,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
	signupSchema,
	loginSchema,
	otpSchema,
} from "../validators/auth.validator";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// User routes
router.post("/request-otp", validate(signupSchema), requestOtp);
router.post("/verify-otp", validate(otpSchema), verifyOtp);
router.post("/user/login", validate(loginSchema), userLogin);

// Doctor routes
router.post("/doctor/login", validate(loginSchema), doctorLogin);

//common routes
router.post("/refresh-token", refreshToken);
router.post("/logout", authenticate, logout);
export default router;
