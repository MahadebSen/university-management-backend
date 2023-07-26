import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiErrors';
import { UserModel } from '../user/user.model';
import { ILoginUser } from './auth.interface';

const loginUser = async (payload: ILoginUser) => {
  const { id, password } = payload;

  // Creating user instance for using instance methods
  const user = new UserModel();

  // Check user existance (instance method)
  const isUserExist = await user.isUserExist(id);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }

  // Check password
  if (
    isUserExist.password &&
    !user.isPasswordMatched(password, isUserExist.password)
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  // Generate access token && refresh token

  return id;
};

export const AuthService = {
  loginUser,
};
