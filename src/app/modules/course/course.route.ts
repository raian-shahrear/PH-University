import express from 'express';
import { CourseControllers } from './course.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);
router.get('/', CourseControllers.getAllCourses);
router.get('/:id', CourseControllers.getSingleCourse);
router.delete('/:id', CourseControllers.deleteCourse);
router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);
router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.facultiesForCourseValidationSchema),
  CourseControllers.assignFacultiesForCourse,
);
router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.facultiesForCourseValidationSchema),
  CourseControllers.removeFacultiesFormCourse,
);

export const CourseRoutes = router;
