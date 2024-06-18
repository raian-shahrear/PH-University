import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../users/user.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { crateToken } from './auth.utils';

const loginUser = async (payload: TLoginUser) => {
  // checking user is exist or not by userId
  const existedUser = await UserModel.isUserExistByCustomId(payload.id);
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
  // checking password matched or not
  if (
    !(await UserModel.isPasswordMatched(
      payload?.password,
      existedUser.password,
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');
  }

  // create access_token and sent to a client
  // to create secretKey => node => require('crypto').randomBytes(32).toString('hex')
  const jwtPayload = {
    userId: existedUser.id,
    role: existedUser.role,
  };
  const accessToken = crateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  // create refresh_token and sent to a client
  // to create secretKey => node => require('crypto').randomBytes(32).toString('hex')
  const refreshToken = crateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expire_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPassChange: existedUser.needsPassChange,
  };
};

const changePassword = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking user is exist or not by userId
  const existedUser = await UserModel.isUserExistByCustomId(user.userId);
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
  // checking password matched or not
  if (
    !(await UserModel.isPasswordMatched(
      payload?.oldPassword,
      existedUser.password,
    ))
  ) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched!');
  }

  // hash newPassword
  const hashedNewPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await UserModel.findOneAndUpdate(
    {
      id: user.userId,
      role: user.role,
    },
    {
      password: hashedNewPassword,
      needsPassChange: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};

const refreshToken = async (token: string) => {
  // chucking a token sent from the client or not
  if (!token) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not an authorized user!',
    );
  }

  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  const { userId, iat } = decoded;

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
        'You are unauthorized! Please login again!',
      );
    }
  }

  // create access_token and sent to a client
  // to create secretKey => node => require('crypto').randomBytes(32).toString('hex')
  const jwtPayload = {
    userId: existedUser.id,
    role: existedUser.role,
  };
  const accessToken = crateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expire_in as string,
  );

  return { accessToken };
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
};
