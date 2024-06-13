import { Schema, model } from 'mongoose';
import { TAdmin, TAdminName } from './admin.interface';

const adminNameSchema = new Schema<TAdminName>(
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

const adminSchema = new Schema<TAdmin>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'User',
    },
    designation: {
      type: String,
      required: true,
    },
    name: {
      type: adminNameSchema,
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
      unique: true,
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
    profileImage: {
      type: String,
    },
    managementDepartment: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// hide deleted:soft data before showing
adminSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
adminSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
export const AdminModel = model<TAdmin>('Admin', adminSchema);
