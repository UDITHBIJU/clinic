import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
	_id: Types.ObjectId;
	username: string;
	email: string;
	password: string;
}

const UserSchema: Schema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: /.+\@.+\..+/,
		},
		password: {
			type: String,
			required: true,
		},
	},
);

export const User = mongoose.model<IUser>("User", UserSchema);
