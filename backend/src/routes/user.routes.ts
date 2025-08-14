import Router from "express";

import { authenticate } from "../middlewares/auth.middleware";
import { bookAppointment, getAppointments,getAllDoctors,getAvailableSlots } from "../controllers/appointment.controller";

const router = Router();

// User routes
router.get("/appointments", authenticate(["user"]),getAppointments);
router.post("/appointments/book", authenticate(["user"]), bookAppointment);
router.get("/doctors", authenticate(["user"]), getAllDoctors);
router.get("/slots", authenticate(["user","doctor"]), getAvailableSlots);
export default router;
