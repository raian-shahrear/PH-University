import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { user_role } from '../users/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/change-password',
  auth(user_role.admin, user_role.faculty, user_role.student),
  validateRequest(AuthValidations.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

export const AuthRoutes = router;
