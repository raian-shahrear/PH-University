import { Types } from 'mongoose';

export interface TFacultyName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  name: TFacultyName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  profileImage?: string;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};
