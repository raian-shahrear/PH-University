import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
  },
  { timestamps: true },
);

// checking the department is exist or not
academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExist = await AcademicDepartmentModel.findOne({
    name: this.name,
  });
  if (isDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Department is already exist!');
  }
  next();
});
// checking the department existing id before updating
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isDepartmentExist = await AcademicDepartmentModel.findOne({
    _id: query,
  });
  if (!isDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This department is not exist!');
  }
  next();
});

export const AcademicDepartmentModel = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
