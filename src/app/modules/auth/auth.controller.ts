import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AuthService } from './auth.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import config from '../../../config';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  const { refreshToken, ...loginResponse } = await result;

  // set refreshToken into cookie
  const cookieOption = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOption);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User loggedin successfully',
    data: loginResponse,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  // set refreshToken into cookie
  const cookieOption = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOption);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User loggedin successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { ...passwordData } = req.body;

  const result = await AuthService.changePassword(user, passwordData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
};
