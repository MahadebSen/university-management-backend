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
  // verify token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelper.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }

  const { id } = verifiedToken;

  // checking deleted user's refresh token
  const user = new UserModel();
  const isUserExist = await user.isUserExist(id);

  if (isUserExist) {
    // generate new token
    const newAccessToken = jwtHelper.createToken(
      { id: isUserExist.id, role: isUserExist.role },
      config.jwt.secret as Secret,
      config.jwt.expires_in as string
    );
    return {
      accessToken: newAccessToken,
    };
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
};

export const AuthService = {
  loginUser,
  refreshToken,
};
