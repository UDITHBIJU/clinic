import { Request, Response } from "express";
import { Leave } from "../models/leave.model";
import { Slot } from "../models/slot.model";

export const markLeave = async (req: Request, res: Response) => {
	try {
		const { date, slotId } = req.body;
		const doctorId = (req as any).user.id;
		const role = (req as any).user.role;

		if (role !== "doctor") {
			return res.status(403).json({ message: "Only doctors can mark leave" });
		}

		const leaveDate = new Date(date);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (leaveDate < today) {
			return res.status(400).json({ message: "Cannot mark leave in the past" });
		}

		const slotExists = await Slot.findById(slotId);
		if (!slotExists) {
			return res.status(404).json({ message: "Slot not found" });
		}

		const existingLeave = await Leave.findOne({
			doctor: doctorId,
			date: leaveDate,
			slot: slotId,
		});

		if (existingLeave) {
			return res
				.status(400)
				.json({ message: "Leave already exists for this slot" });
		}

		const leave = await Leave.create({
			doctor: doctorId,
			date: leaveDate,
			slot: slotId,
		});

		res.status(201).json({ message: "Leave marked successfully", leave });
	} catch (error) {
		if ((error as any).code === 11000) {
			return res
				.status(400)
				.json({ message: "Leave already marked for this slot" });
		}
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
};
