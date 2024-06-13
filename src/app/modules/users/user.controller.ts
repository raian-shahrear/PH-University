import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

// create a student
const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;
  const result = await UserServices.createStudentIntoDB(password, student);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Student is created successfully!',
    data: result,
  });
});

// create an admin
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;
  const result = await UserServices.createAdminIntoDB(password, admin);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Admin is created successfully!',
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty } = req.body;
  const result = await UserServices.createFacultyIntoDB(password, faculty);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Faculty is created successfully!',
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  createAdmin,
  createFaculty,
};
