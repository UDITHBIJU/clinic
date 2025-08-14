import { Schema, model, Document, Types } from "mongoose";

export interface ILeave extends Document {
	doctor: Types.ObjectId;
	date: Date;
	slot: Types.ObjectId;
}

const leaveSchema = new Schema<ILeave>({
	doctor: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
	date: { type: Date, required: true },
	slot: { type: Schema.Types.ObjectId, ref: "Slot", required: true },
});

leaveSchema.index({ doctor: 1, date: 1, slot: 1 }, { unique: true });

export const Leave = model<ILeave>("Leave", leaveSchema);
