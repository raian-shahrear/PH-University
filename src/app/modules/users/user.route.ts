import express from 'express';
import { UserControllers } from './user.controller';
import { studentValidations } from '../students/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidations } from '../admin/admin.validation';
import { FacultyValidations } from '../faculty/faculty.validation';
import auth from '../../middlewares/auth';
import { user_role } from './user.constant';

const router = express.Router();

router.post(
  '/create-student',
  auth(user_role.admin),
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);
router.post(
  '/create-faculty',
  auth(user_role.admin),
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);
router.post(
  '/create-admin',
  // auth(user_role.admin),
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

export const UserRoutes = router;
