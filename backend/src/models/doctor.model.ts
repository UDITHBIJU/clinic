import mongoose, { Document, Schema,Types } from "mongoose";

export interface IDoctor extends Document {
    _id: Types.ObjectId;
	username: string;
	email: string;
	password: string;
	speciality: string;
	department: string;
}

const doctorSchema = new Schema<IDoctor>({
	username: { type: String, required: true },
	email: {
		type: String,
		required: true,
		unique: true,
		match: /.+\@.+\..+/,
	},
	password: { type: String, required: true },
	speciality: { type: String, required: true },
	department: { type: String, required: true },
});

export const Doctor = mongoose.model<IDoctor>("Doctor", doctorSchema);
 