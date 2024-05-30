import { StudentModel } from './student.model';

// get all student
const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find();
  return result;
};

// get single student
const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ _id: id });
  return result;
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
};
