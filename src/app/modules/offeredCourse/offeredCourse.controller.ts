import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferedCourseServices } from './offeredCourse.service';

// create an OfferedCourse
const createOfferedCourse = catchAsync(async (req, res) => {
  const offeredCourse = req.body;
  const result =
    await OfferedCourseServices.createOfferedCourseIntoDB(offeredCourse);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Offered course is created successfully!',
    data: result,
  });
});

// get all OfferedCourses
const getAllOfferedCourses = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query,
  );
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Offered courses are retrieved successfully!',
    data: result,
  });
});

// get single OfferedCourse
const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Offered course is retrieved successfully!',
    data: result,
  });
});

// update an OfferedCourse
const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body,
  );
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Offered course is updated successfully!',
    data: result,
  });
});

// delete an OfferedCourse
const deleteOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Offered course is deleted successfully!',
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
