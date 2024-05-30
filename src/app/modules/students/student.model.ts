import { Schema, model } from 'mongoose';
import {
  Guardian,
  LocalGuardian,
  Student,
  Username,
} from './student.interface';

const usernameSchema = new Schema<Username>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const guardianSchema = new Schema<Guardian>(
  {
    fatherName: {
      type: String,
      required: true,
      trim: true,
    },
    fatherOccupation: {
      type: String,
      required: true,
      trim: true,
    },
    fatherContactNo: {
      type: String,
      required: true,
      trim: true,
    },
    motherName: {
      type: String,
      required: true,
      trim: true,
    },
    motherOccupation: {
      type: String,
      required: true,
      trim: true,
    },
    motherContactNo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const localGuardianSchema = new Schema<LocalGuardian>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    occupation: {
      type: String,
      required: true,
      trim: true,
    },
    contactNo: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    relationship: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const studentSchema = new Schema<Student>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'UserModel',
    },
    name: {
      type: usernameSchema,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    contactNo: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyContactNo: {
      type: String,
      required: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      trim: true,
    },
    presentAddress: {
      type: String,
      required: true,
      trim: true,
    },
    permanentAddress: {
      type: String,
      required: true,
      trim: true,
    },
    guardian: {
      type: guardianSchema,
      required: true,
    },
    localGuardian: {
      type: localGuardianSchema,
    },
    profileImage: {
      type: String,
    },
    admissionSemester: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const StudentModel = model<Student>('Student', studentSchema);