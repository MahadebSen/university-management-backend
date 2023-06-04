import { Model, Schema, model } from 'mongoose'
import { IUser } from './users.interface'

// Custom method
type UserModelType = Model<IUser, object>

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
)

// user model
export const userModel = model<IUser, UserModelType>('User', userSchema)
