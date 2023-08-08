import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiErrors';
import { UserModel } from '../user/user.model';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
} from './auth.interface';
import { jwtHelper } from '../../../helpers/jwtHelper';
import config from '../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
// import bcrypt from 'bcrypt';

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

// Change password approach: 1
/*
const changePassword = async (
  user: JwtPayload | null,
  passwordData: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = await passwordData;

  // Creating user instance for using instance methods
  const userModel = new UserModel();

  // Check user existance (instance method)
  const isUserExist = await userModel.isUserExist(user?.id);

  if (isUserExist) {
    // Check password (instance method) (await)
    if (
      isUserExist.password &&
      !(await userModel.isPasswordMatched(oldPassword, isUserExist.password))
    ) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
    }

    // hase password before saving
    const newHashPassword = bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_round)
    );

    const query = { id: user?.id };

    const updatedData = {
      password: newHashPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    };

    await UserModel.findOneAndDelete(query, updatedData);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }
};
*/

// Change password approach: 2
const changePassword = async (
  user: JwtPayload | null,
  passwordData: IChangePassword
): Promise<void> => {
  const { oldPassword, newPassword } = await passwordData;

  // Creating user instance for using instance methods
  const userModel = new UserModel();

  // Check user existance (instance method)
  const isUserExist = await UserModel.findOne({ id: user?.id }).select(
    '+password'
  );

  if (isUserExist) {
    // Check password (instance method) (await)
    if (
      isUserExist.password &&
      !(await userModel.isPasswordMatched(oldPassword, isUserExist.password))
    ) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
    }

    isUserExist.password = newPassword;
    isUserExist.needsPasswordChange = false;

    // updating user using save() method
    isUserExist.save();
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
};
