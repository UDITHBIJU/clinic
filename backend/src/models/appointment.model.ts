import { Schema, model, Document, Types } from "mongoose";

export interface IAppointment extends Document {
	patientName: string;
	patientAge: number;
	user: Types.ObjectId;
	date: Date;
	doctor: Types.ObjectId;
	slot: Types.ObjectId;
}

const appointmentSchema = new Schema<IAppointment>({
	patientName: { type: String, required: true },
	patientAge: { type: Number, required: true },
	user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
	slot: { type: Schema.Types.ObjectId, ref: "Slot", required: true },
	date: { type: Date, required: true },
});


export const Appointment = model<IAppointment>(
	"Appointment",
	appointmentSchema
);
