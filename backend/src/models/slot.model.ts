import { Schema, model, Document } from "mongoose";

export interface ISlot extends Document {
	startTime: string;
	endTime: string;
}

const slotSchema = new Schema<ISlot>({
	startTime: { type: String, required: true },
	endTime: { type: String, required: true },
});

export const Slot = model<ISlot>("Slot", slotSchema);
