import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentServices } from './academicDepartment.service';

// create academic department
const createAcademicDepartment = catchAsync(async (req, res) => {
  const academicDepartment = req.body;
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(
      academicDepartment,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic department is created successfully!',
    data: result,
  });
});

// get all academic departments
const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic departments are retrieved successfully!',
    data: result,
  });
});

// get single academic department
const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { academicDepartmentId } = req.params;
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(
      academicDepartmentId,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic department is retrieved successfully!',
    data: result,
  });
});

// update academic department
const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { academicDepartmentId } = req.params;
  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
      academicDepartmentId,
      req.body,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Academic department is updated successfully!',
    data: result,
  });
});

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
