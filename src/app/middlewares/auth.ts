import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiErrors';
import httpStatus from 'http-status';
import { jwtHelper } from '../../helpers/jwtHelper';
import config from '../../config';
import { Secret } from 'jsonwebtoken';

const auth =
  (...requiredRole: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      // verify token
      let verifiedUser = null;
      verifiedUser = jwtHelper.verifyToken(token, config.jwt.secret as Secret);

      req.user = verifiedUser; // id, role

      // Role guard
      if (requiredRole.length && !requiredRole.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
