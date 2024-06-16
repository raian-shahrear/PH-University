import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SemesterRegistrationServices } from './semesterRegistration.service';

// create a semesterRegistration
const createSemesterRegistration = catchAsync(async (req, res) => {
  const semesterRegistration = req.body;
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      semesterRegistration,
    );
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Semester Registration is created successfully!',
    data: result,
  });
});

// get all semesterRegistrations
const getAllSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationFromDB();
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Registered semesters are retrieved successfully!',
    data: result,
  });
});

// get single semesterRegistration
const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Registered semester is retrieved successfully!',
    data: result,
  });
});

// update a semesterRegistration
const updateSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
      id,
      req.body,
    );
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Registered semester is updated successfully!',
    data: result,
  });
});

// delete a SemesterRegistration
const deleteSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(id);
  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Registered semester is deleted successfully!',
    data: result,
  });
});

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
