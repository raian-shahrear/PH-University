import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

// get all students
const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();

    // send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Students are retrieved successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// get a student by id
const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    // send response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Student is retrieved successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
};
