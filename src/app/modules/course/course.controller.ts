import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

// create a course
const createCourse = catchAsync(async (req, res) => {
  const course = req.body;
  const result = await CourseServices.createCourseIntoDB(course);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Course is created successfully!',
    data: result,
  });
});

// get all courses
const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Courses are retrieved successfully!',
    data: result,
  });
});

// get single course
const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Course is retrieved successfully!',
    data: result,
  });
});

// delete a course
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Course is deleted successfully!',
    data: result,
  });
});

// update a course
const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.updateCourseIntoDB(id, req.body);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Course is updated successfully!',
    data: result,
  });
});

// assign faculties for a course
const assignFacultiesForCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.assignFacultiesForCourseIntoDB(
    courseId,
    faculties,
  );
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Faculties are assigned for a course successfully!',
    data: result,
  });
});

// remove faculties for a course
const removeFacultiesFormCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;
  const result = await CourseServices.removeFacultiesFormCourseFromDB(
    courseId,
    faculties,
  );
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Faculties are removed form a course successfully!',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
  updateCourse,
  assignFacultiesForCourse,
  removeFacultiesFormCourse,
};
