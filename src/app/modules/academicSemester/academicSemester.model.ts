import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import { Month, SemesterCode, SemesterName } from './academicSemester.constant';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: SemesterName,
      required: true,
      unique: true,
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

export const AcademicSemesterModel = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
