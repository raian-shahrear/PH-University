import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

// get all admin
const getAllAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminFromDB(req.query);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Admins are retrieved successfully!',
    data: result,
  });
});

// get single admin
const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(id);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Admin is retrieved successfully!',
    data: result,
  });
});

// delete an admin
const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.deleteAdminFromDB(id);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Admin is deleted successfully!',
    data: result,
  });
});

// update an admin
const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const admin = req.body;
  const result = await AdminServices.updateAdminIntoDB(id, admin);

  // send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Admin is updated successfully!',
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmin,
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
};
