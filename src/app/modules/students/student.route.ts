import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { user_role } from '../users/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(user_role.admin, user_role.faculty, user_role.student),
  StudentControllers.getAllStudents,
);
router.get(
  '/:id',
  auth(user_role.admin, user_role.faculty, user_role.student),
  StudentControllers.getSingleStudent,
);
router.patch(
  '/:id',
  auth(user_role.admin),
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
);
router.delete('/:id', auth(user_role.admin), StudentControllers.deleteStudent);

export const StudentRoutes = router;
