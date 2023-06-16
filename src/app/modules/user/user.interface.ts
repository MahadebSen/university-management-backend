import { Model } from 'mongoose';

export type IUser = {
  id: string;
  role: string;
  password: string;
};

// Custom method
export type UserModelType = Model<IUser, Record<string, unknown>>;
