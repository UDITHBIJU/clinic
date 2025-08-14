import Router from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { markLeave } from "../controllers/leave.controller";

const router = Router();

// Doctor routes
router.post("/leave", authenticate(["doctor"]), markLeave);

export default router;

