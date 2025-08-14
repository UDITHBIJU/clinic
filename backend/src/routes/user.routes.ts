import Router from "express";

import { authenticate } from "../middlewares/auth.middleware";
import { bookAppointment, getAppointments } from "../controllers/appointment.controller";

const router = Router();

// User routes
router.get("/appointments", authenticate(["user"]),getAppointments);
router.post("/appointments/book", authenticate(["user"]), bookAppointment);
export default router;
