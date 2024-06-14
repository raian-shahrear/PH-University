import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { UserModel } from '../users/user.model';
import { TFaculty } from './faculty.interface';
import { FacultyModel } from './faculty.model';
import mongoose from 'mongoose';

// get all faculties
const getAllFacultyFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = [
    'email',
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'presentAddress',
    'permanentAddress',
    'contactNo',
  ];
  const facultyQuery = new QueryBuilder(
    FacultyModel.find()
      .populate('academicFaculty')
      .populate('academicDepartment'),
    query,
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldLimiting();
  const result = await facultyQuery.queryModel;
  return result;
};

// get single faculty
const getSingleFacultyFromDB = async (id: string) => {
  // checking the id exist or not
  const isFacultyExist = await FacultyModel.findById(id);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This faculty is not exist!');
  }

  const result = await FacultyModel.findById(id)
    .populate('academicFaculty')
    .populate('academicDepartment');
  return result;
};

// update a faculty
const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  // checking the id exist or not
  const isFacultyExist = await FacultyModel.findById(id);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This faculty is not exist!');
  }

  const { name, ...remainingData } = payload;
  const modifiedData: Record<string, unknown> = { ...remainingData };
  // transform non-primitive data like "name.firstName = XYZ"
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }

  const result = await FacultyModel.findByIdAndUpdate(
    id,
    { $set: modifiedData },
    { new: true, runValidators: true },
  );
  return result;
};

// delete a faculty
const deleteFacultyFromDB = async (id: string) => {
  // checking the id exist or not
  const isFacultyExist = await FacultyModel.findById(id);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This faculty is not exist!');
  }

  // create a session
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();
    // delete faculty (transaction-1)
    const deleteFaculty = await FacultyModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteFaculty) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete this faculty!',
      );
    }

    // delete user (transaction-2)
    const userId = deleteFaculty.user;
    const deleteUser = await UserModel.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete this user!');
    }

    // end session
    await session.commitTransaction();
    await session.endSession();

    return deleteFaculty;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `error: ${err}`);
  }
};

export const FacultyServices = {
  getAllFacultyFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
