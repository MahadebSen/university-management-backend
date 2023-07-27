import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiErrors';
import { UserModel } from '../user/user.model';
import { ILoginUser, ILoginUserResponse } from './auth.interface';
import { jwtHelper } from '../../../helpers/jwtHelper';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  // Creating user instance for using instance methods
  const user = new UserModel();

  // Check user existance (instance method)
  const isUserExist = await user.isUserExist(id);

  if (isUserExist) {
    // Check password (instance method) (await)
    if (
      isUserExist.password &&
      !(await user.isPasswordMatched(password, isUserExist.password))
    ) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
    }

    // Generate access token && refresh token
    const { id, role, needsPasswordChange } = isUserExist;

    const accessToken = jwtHelper.createToken(
      { id, role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );

    const refreshToken = jwtHelper.createToken(
      { id, role },
      config.jwt.refresh_secret as Secret,
      config.jwt.refresh_expires_in as string
    );

    return {
      accessToken,
      refreshToken,
      needsPasswordChange,
    };
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }
};

const refreshToken = async (token: string) => {
  return token;
};

export const AuthService = {
  loginUser,
  refreshToken,
};
