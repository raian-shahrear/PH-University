import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.service';

// get all faculties
const getAllFaculty = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultyFromDB(req.query);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Faculties are retrieved successfully!',
    data: result,
  });
});

// get single faculty
const getSingleFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB(facultyId);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Faculty is retrieved successfully!',
    data: result,
  });
});

// delete a faculty
const deleteFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(facultyId);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Faculty is deleted successfully!',
    data: result,
  });
});

// update a faculty
const updateFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const faculty = req.body;
  const result = await FacultyServices.updateFacultyIntoDB(facultyId, faculty);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Faculty is updated successfully!',
    data: result,
  });
});

export const FacultyControllers = {
  getAllFaculty,
  getSingleFaculty,
  deleteFaculty,
  updateFaculty,
};
