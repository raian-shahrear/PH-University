import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

// get all students
const getAllStudents = catchAsync(async (req, res, next) => {
  const result = await StudentServices.getAllStudentsFromDB(req.query);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Students are retrieved successfully!',
    data: result,
  });
});

// get a student by id
const getSingleStudent = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(studentId);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Student is retrieved successfully!',
    data: result,
  });
});

// update a student
const updateStudent = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const { student } = req.body;
  const result = await StudentServices.updateStudentIntoDB(studentId, student);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Student is updated successfully!',
    data: result,
  });
});

// delete:soft a student
const deleteStudent = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const result = await StudentServices.deleteStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Student is deleted successfully!',
    data: result,
  });
});

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
