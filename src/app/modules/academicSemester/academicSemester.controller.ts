import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { AcademicSemesterServices } from './academicSemesterService';

const createAcademicSemester = catchAsync(async (req, res) => {
  const semester = req.body;

  const result =
    await AcademicSemesterServices.createAcademicSemesterIntoDB(semester);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic semester is created successfully!',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
};
