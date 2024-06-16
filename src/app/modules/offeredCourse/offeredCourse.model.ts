import { Schema, model } from 'mongoose';
import { TOfferedCourse } from './offeredCourse.interface';
import { daysArray } from './offeredCourse.constant';

const offeredCourseSchema = new Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: '',
      required: true,
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: '',
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: '',
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: '',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: '',
      required: true,
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: '',
      required: true,
    },
    section: {
      type: Number,
      required: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    days: [
      {
        type: String,
        enum: daysArray,
      },
    ],
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const OfferedCourseModel = model<TOfferedCourse>(
  'OfferedCourse',
  offeredCourseSchema,
);
