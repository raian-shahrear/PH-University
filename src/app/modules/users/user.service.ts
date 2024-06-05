import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { TStudent } from '../students/student.interface';
import { StudentModel } from '../students/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { generatedStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

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

export const UserServices = {
  createStudentIntoDB,
};
