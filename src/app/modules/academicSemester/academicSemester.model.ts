import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import { Month, SemesterCode, SemesterName } from './academicSemester.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: SemesterName,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      enum: SemesterCode,
      required: true,
    },
    startMonth: {
      type: String,
      enum: Month,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Month,
      required: true,
    },
  },
  { timestamps: true },
);

// checking academic semester is exist or not
academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExist = await AcademicSemesterModel.findOne({
    name: this.name,
    year: this.year,
  });

  if (isSemesterExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This semester is already exist!',
    );
  }
  next();
});
// checking the academic semester existing id before updating
academicSemesterSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isSemesterExist = await AcademicSemesterModel.findOne({ _id: query });
  if (!isSemesterExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This semester is not exist!');
  }
  next();
});

export const AcademicSemesterModel = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
