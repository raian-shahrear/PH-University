import { Schema, model } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from './course.interface';

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    prefix: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: Number,
      required: true,
      unique: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    preRequisiteCourses: {
      type: [preRequisiteCoursesSchema],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// hide deleted:soft data before showing
courseSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
courseSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const CourseModel = model<TCourse>('Course', courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      unique: true,
    },
    faculties: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Faculty',
      },
    ],
  },
  { timestamps: true },
);
export const CourseFacultyModel = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultySchema,
);
