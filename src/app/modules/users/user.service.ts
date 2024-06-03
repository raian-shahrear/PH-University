import config from '../../config';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { TStudent } from '../students/student.interface';
import { StudentModel } from '../students/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { generatedStudentId } from './user.utils';

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
  userData.id = await generatedStudentId(admissionSemester);

  // create a user
  const newUser = await UserModel.create(userData);

  // create a student
  if (Object.keys(newUser).length) {
    payload.id = newUser.id;
    payload.user = newUser._id; // referencing id

    const newStudent = await StudentModel.create(payload);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
