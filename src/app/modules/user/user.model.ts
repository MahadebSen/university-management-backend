import { Schema, model } from 'mongoose';
import { IUser, UserModelType } from './user.interface';

// user schema
const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    // createdAt and updatedAt
    timestamps: true,
  }
);

// user model
export const userModel = model<IUser, UserModelType>('User', userSchema);
