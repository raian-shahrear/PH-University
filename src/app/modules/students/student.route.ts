import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

router.get('/', StudentControllers.getAllStudents);
router.get('/:studentId', StudentControllers.getSingleStudent);
// router.put('/:studentId', );
// router.delete('/:studentId', );

export const StudentRoutes = router;
