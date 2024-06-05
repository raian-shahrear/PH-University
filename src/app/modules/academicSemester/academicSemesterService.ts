import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { semesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterModel } from './academicSemester.model';

// create academic semester
const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  // cross-checking academic code
  if (semesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid semester code!');
  }
  const result = await AcademicSemesterModel.create(payload);
  return result;
};

// get all academic semester
const getAllAcademicSemesterFromDB = async () => {
  const result = await AcademicSemesterModel.find();
  return result;
};

// get single academic semester
const getSingleAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemesterModel.findOne({ _id: id });
  return result;
};

// update academic semester
const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  // cross-checking academic code
  if (
    payload.name &&
    payload.code &&
    semesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid semester code!');
  }
  const result = await AcademicSemesterModel.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true },
  );
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
};
