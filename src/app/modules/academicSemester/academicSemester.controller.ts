import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { AcademicSemesterServices } from './academicSemesterService';

// create academic semester
const createAcademicSemester = catchAsync(async (req, res) => {
  const semester = req.body;
  const result =
    await AcademicSemesterServices.createAcademicSemesterIntoDB(semester);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic semester is created successfully!',
    data: result,
  });
});

// get all academic semester
const getAllAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB();
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic semesters are retrieved successfully!',
    data: result,
  });
});

// get single academic semester
const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result =
    await AcademicSemesterServices.getSingleAcademicSemesterFromDB(semesterId);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic semester is retrieved successfully!',
    data: result,
  });
});

// update academic semester
const updateAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
    semesterId,
    req.body,
  );
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic semester is updated successfully!',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
