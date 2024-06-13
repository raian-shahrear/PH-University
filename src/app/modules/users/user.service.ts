import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { TStudent } from '../students/student.interface';
import { StudentModel } from '../students/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import {
  generatedAdminId,
  generatedFacultyId,
  generatedStudentId,
} from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TAdmin } from '../admin/admin.interface';
import { AdminModel } from '../admin/admin.model';
import { TFaculty } from '../faculty/faculty.interface';
import { FacultyModel } from '../faculty/faculty.model';

// create a student
const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create user object
  const userData: Partial<TUser> = {};

  // set password
  userData.password = password || (config.default_pass as string);
  // set role
  userData.role = 'student';
  // generated id
  const admissionSemester: any = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  );

  // create a session
  const session = await mongoose.startSession();

  try {
    // start session
    session.startTransaction();
    userData.id = await generatedStudentId(admissionSemester);

    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session }); // array

    if (!newUser.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create a new user!',
      );
    }
    payload.id = newUser[0].id; // embedded id
    payload.user = newUser[0]._id; // referencing id

    // create a student (transaction-2)
    const newStudent = await StudentModel.create([payload], { session }); // array
    if (!newStudent.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create a new student!',
      );
    }

    // end the session
    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `error: ${err}`);
  }
};

// create an admin
const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_pass as string);
  userData.role = 'admin';

  // create a session
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();
    userData.id = await generatedAdminId();

    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session }); // array

    if (!newUser.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create a new user!',
      );
    }

    payload.id = newUser[0].id; // embedded id
    payload.user = newUser[0]._id; // referencing id

    // create an admin (transaction-2)
    const newAdmin = await AdminModel.create([payload], { session }); // array
    if (!newAdmin.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create a new admin!',
      );
    }

    // end the session
    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `error: ${err}`);
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_pass as string);
  userData.role = 'faculty';

  // create a session
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generatedFacultyId();

    // create a user (transaction-1)
    const newUser = await UserModel.create([userData], { session }); // array

    if (!newUser.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create a new user!',
      );
    }

    payload.id = newUser[0].id; // embedded id
    payload.user = newUser[0]._id; // referencing id

    // create a faculty (transaction-2)
    const newFaculty = await FacultyModel.create([payload], { session }); // array
    if (!newFaculty.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to create a new faculty!',
      );
    }

    // end the session
    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `error: ${err}`);
  }
};

export const UserServices = {
  createStudentIntoDB,
  createAdminIntoDB,
  createFacultyIntoDB,
};
