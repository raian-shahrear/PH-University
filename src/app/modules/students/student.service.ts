import { StudentModel } from './student.model';
import { UserModel } from '../users/user.model';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';

// get all student
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const studentSearchableFields = [
    'email',
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'presentAddress',
    'permanentAddress',
    'contactNo',
  ];
  const studentQuery = new QueryBuilder(
    StudentModel.find()
      .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fieldLimiting();
  const result = await studentQuery.queryModel;
  return result;
};

// get single student
const getSingleStudentFromDB = async (id: string) => {
  // checking the id exist or not
  const isStudentExist = await StudentModel.findById(id)
    .populate('user')
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  if (!isStudentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This student is not exist!');
  }

  const result = await StudentModel.findById(id)
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

// update a student
const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  // checking the id exist or not
  const isStudentExist = await StudentModel.findById(id);
  if (!isStudentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This student is not exist!');
  }

  const { name, guardian, localGuardian, ...remainingData } = payload;
  const modifiedPayload: Record<string, unknown> = { ...remainingData };

  // transform non-primitive data like "name.firstName = XYZ"
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedPayload[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedPayload[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedPayload[`localGuardian.${key}`] = value;
    }
  }

  // update using modified data
  const result = await StudentModel.findByIdAndUpdate(
    id,
    { $set: modifiedPayload },
    { new: true, runValidators: true },
  );

  return result;
};

// delete a student
const deleteStudentFromDB = async (id: string) => {
  // checking the id exist or not
  const isStudentExist = await StudentModel.findById(id);
  if (!isStudentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This student is not exist!');
  }

  // create a session
  const session = await mongoose.startSession();

  try {
    // start session
    session.startTransaction();
    // delete student (transaction-1)
    const deleteStudent = await StudentModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deleteStudent) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete this student!',
      );
    }

    // delete user (transaction-2)
    const userId = deleteStudent.user;
    const deleteUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete this user!');
    }

    // end session
    await session.commitTransaction();
    await session.endSession();

    return deleteStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `error: ${err}`);
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
