import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { UserModel } from '../users/user.model';
import { TAdmin } from './admin.interface';
import { AdminModel } from './admin.model';
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';

// get all admin
const getAllAdminFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = [
    'email',
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'presentAddress',
    'permanentAddress',
    'contactNo',
    'managementDepartment',
    'designation',
  ];
  const AdminQuery = new QueryBuilder(AdminModel.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldLimiting();
  const result = await AdminQuery.queryModel;
  return result;
};

// get single admin
const getSingleAdminFromDB = async (id: string) => {
  // checking the id exist or not
  const isAdminExist = await AdminModel.findOne({ id });
  if (!isAdminExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This admin is not exist!');
  }

  const result = await AdminModel.findOne({ id });
  return result;
};

// update an admin
const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
  // checking the id exist or not
  const isAdminExist = await AdminModel.findOne({ id });
  if (!isAdminExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This admin is not exist!');
  }

  const { name, ...remainingData } = payload;
  const modifiedData: Record<string, unknown> = { ...remainingData };

  // transform non-primitive data like "name.firstName = XYZ"
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }

  const result = await AdminModel.findOneAndUpdate(
    { id },
    { $set: modifiedData },
    { new: true, runValidators: true },
  );
  return result;
};

// delete an admin
const deleteAdminFromDB = async (id: string) => {
  // checking the id exist or not
  const isAdminExist = await AdminModel.findOne({ id });
  if (!isAdminExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This admin is not exist!');
  }

  // create a session
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();
    // delete user (transaction-1)
    const deleteUser = await UserModel.findOneAndUpdate(
      { id },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete this user!');
    }

    // delete admin (transaction-2)
    const deleteAdmin = await AdminModel.findOneAndUpdate(
      { id },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deleteAdmin) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete this admin!',
      );
    }
    // end session
    await session.commitTransaction();
    await session.endSession();

    return deleteAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `error: ${err}`);
  }
};

export const AdminServices = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
