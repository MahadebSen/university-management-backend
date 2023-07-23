import { Schema, model } from 'mongoose';
import { IUser, UserModelType } from './user.interface';

// user schema
const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty' },
    admin: { type: String, ref: 'Admin' },
  },
  {
    // createdAt and updatedAt
    timestamps: true,
  }
);

// user model
export const UserModel = model<IUser, UserModelType>('User', userSchema);
