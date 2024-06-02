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

export const UserControllers = {
  createStudent,
};
