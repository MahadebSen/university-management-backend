import config from '../../../config/index';
import ApiError from '../../../errors/ApiErrors';
import { IUser } from './user.interface';
import { userModel } from './user.model';
import { generateUserId } from './user.utils';

const createUser = async (payload: IUser): Promise<IUser | null> => {
  // auto generated incremental Id
  const id = await generateUserId();
  payload.id = id;

  // Default password
  if (!payload.password) {
    payload.password = config.default_user_pass as string;
  }

  // Create user using model
  const createdUser = await userModel.create(payload);

  if (!createdUser) {
    // throw new Error('Failed to create user!')
    // or,
    throw new ApiError(400, 'Failed to create user!');
  } else {
    return createdUser;
  }
};

export const UserService = {
  createUser,
};
