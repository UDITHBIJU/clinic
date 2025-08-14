import { Request, Response } from "express";
import { Appointment } from "../models/appointment.model";
import { Leave } from "../models/leave.model";
import { Slot } from "../models/slot.model";
import { Doctor } from "../models/doctor.model";

export const bookAppointment = async (req: Request, res: Response) => {
	try {
		const { doctorId, date, slotId, patientName, patientAge } = req.body;

		const bookingDate = new Date(date);
		bookingDate.setHours(0, 0, 0, 0);

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const startOfBookingDay = new Date(bookingDate);
		startOfBookingDay.setHours(0, 0, 0, 0);
		
		const endOfBookingDay = new Date(bookingDate);
		endOfBookingDay.setHours(23, 59, 59, 999);

		const maxDate = new Date();
		maxDate.setDate(today.getDate() + 30); 
		if (bookingDate <= today) {
			return res
				.status(400)
				.json({ message: "Cannot book for today or past dates" });
		}

		if (bookingDate > maxDate) {
			return res
				.status(400)
				.json({ message: "Booking can only be made up to 1 month in advance" });
		}
		const slot = await Slot.findById(slotId);
		if (!slot) return res.status(404).json({ message: "Slot not found" });

		const isDoctorLeave = await Leave.findOne({
			doctor: doctorId,
			date: { $gte: startOfBookingDay, $lte: endOfBookingDay },
			slot: slotId,
		});

		if (isDoctorLeave) {
			return res.status(400).json({ message: "Doctor is on leave for this slot" });
		}

		const leave = await Leave.findOne({
			doctor: doctorId,
			date: bookingDate,
			slot: slotId,
		});
		if (leave)
			return res
				.status(400)
				.json({ message: "Doctor is on leave for this slot" });

		const appointment = await Appointment.create({
			patientName,
			patientAge,
			doctor: doctorId,
			slot: slotId,
			date: bookingDate,
			user: (req as any).user.id,
		});

		res
			.status(201)
			.json({ message: "Appointment booked successfully", appointment });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getAppointments = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const appointments = await Appointment.find({ user: userId })
			.select("patientName patientAge date slot doctor")
            .populate("doctor", "username")
            .populate("slot", "startTime endTime")
            .sort({ date: -1 });
        res.status(200).json({ appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllDoctors = async (req: Request, res: Response) => {
	try {
		const doctors = await Doctor.find({}).select("username speciality department _id");
		res.status(200).json(doctors);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
}	

export const getAvailableSlots = async (req: Request, res: Response) => {
	try {
		const slots = await Slot.find({});
		res.status(200).json(slots);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};
