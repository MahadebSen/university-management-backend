import { Schema, model } from 'mongoose';
import { IUser, IUserMethods, UserModelType } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

// user schema
const userSchema = new Schema<IUser, Record<string, never>, IUserMethods>(
  {
    id: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    // select: 0 will remove the password field from the response
    password: { type: String, required: true, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty' },
    admin: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  {
    // createdAt and updatedAt
    timestamps: true,
  }
);

// Instance method
// 1. user checking
userSchema.methods.isUserExist = async function (
  id: string
): Promise<Pick<
  IUser,
  'id' | 'password' | 'role' | 'needsPasswordChange'
> | null> {
  const user = await UserModel.findOne(
    { id },
    { id: 1, password: 1, role: 1, needsPasswordChange: 1 }
  );

  return user;
};

// 2. password checking
userSchema.methods.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  const isMatched = await bcrypt.compare(givenPassword, savedPassword);

  return isMatched;
};

userSchema.pre('save', async function (next) {
  // hashing user password
  // here you can access your document using `this` keyword.
  // `this` is your whole document before save in the collection.
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round)
  );

  next();
});

// user model
export const UserModel = model<IUser, UserModelType>('User', userSchema);
