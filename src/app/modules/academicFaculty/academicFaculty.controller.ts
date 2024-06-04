import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicFacultyServices } from './academicFaculty.service';

// create academic faculty
const createAcademicFaculty = catchAsync(async (req, res) => {
  const academicFaculty = req.body;
  const result =
    await AcademicFacultyServices.createAcademicFacultyIntoDB(academicFaculty);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic faculty is created successfully!',
    data: result,
  });
});

// get all academic faculties
const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic faculties are retrieved successfully!',
    data: result,
  });
});

// get single academic faculty
const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { academicFacultyId } = req.params;
  const result =
    await AcademicFacultyServices.getSingleAcademicFacultyFromDB(
      academicFacultyId,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic faculty is retrieved successfully!',
    data: result,
  });
});

// update academic faculty
const updateAcademicFaculty = catchAsync(async (req, res) => {
  const { academicFacultyId } = req.params;
  const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(
    academicFacultyId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic faculty is updated successfully!',
    data: result,
  });
});

export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
