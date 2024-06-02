import config from '../../config';
import { TStudent } from '../students/student.interface';
import { StudentModel } from '../students/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';

// create a student
const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create user object
  const userData: Partial<TUser> = {};

  // set password
  userData.password = password || (config.default_pass as string);
  // set role
  userData.role = 'student';
  // set id manually
  userData.id = `${Math.floor(10000000 + Math.random() * 90000000)}`;

  // create a user
  const newUser = await UserModel.create(userData);

  // create a student
  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id; // referencing id

    const newStudent = await StudentModel.create(studentData);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
