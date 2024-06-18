import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/users/user.interface';
import { UserModel } from '../modules/users/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // chucking a token sent from the client or not
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not an authorized user!',
      );
    }

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    const { role, userId, iat } = decoded;

    // checking the token is valid or not
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not an authorized user!',
      );
    }
    // checking user is exist or not by userId
    const existedUser = await UserModel.isUserExistByCustomId(userId);
    if (!existedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }
    // checking user is deleted softly or not
    const isUserDeleted = existedUser?.isDeleted;
    if (isUserDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
    }
    // checking user status is blocked or not
    const userStatus = existedUser?.status;
    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
    }
    // checking token issuedAt before passwordChanged (if passwordChanged is bigger than issuedAt)
    if (existedUser?.passwordChangedAt && iat) {
      const passwordChangedAt =
        new Date(existedUser?.passwordChangedAt).getTime() / 1000;
      if (passwordChangedAt > iat) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          'You are not authorized! Please login again!',
        );
      }
    }

    // add the decoded data as user to the req
    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
