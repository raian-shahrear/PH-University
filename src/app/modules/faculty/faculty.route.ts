import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyValidations } from './faculty.validation';
import auth from '../../middlewares/auth';
import { user_role } from '../users/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(user_role.admin, user_role.faculty),
  FacultyControllers.getAllFaculty,
);
router.get(
  '/:id',
  auth(user_role.admin, user_role.faculty),
  FacultyControllers.getSingleFaculty,
);
router.patch(
  '/:id',
  auth(user_role.admin),
  validateRequest(FacultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);
router.delete('/:id', auth(user_role.admin), FacultyControllers.deleteFaculty);

export const FacultyRoutes = router;
