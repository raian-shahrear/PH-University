import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const user = req.body;
  const result = await AuthServices.loginUser(user);

  // set refresh token to the cookie
  const { refreshToken, accessToken, needsPassChange } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
  });

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User is logged in successfully!',
    data: { accessToken, needsPassChange },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const { ...passwordData } = req.body;
  const result = await AuthServices.changePassword(user, passwordData);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password is changed successfully!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});
export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
};
