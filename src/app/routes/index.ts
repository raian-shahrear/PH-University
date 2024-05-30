import express from 'express';
import { StudentRoutes } from '../modules/students/student.route';
import { UserRoutes } from '../modules/users/user.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
];

moduleRoutes.forEach((r) => router.use(r.path, r.route));

export default router;
