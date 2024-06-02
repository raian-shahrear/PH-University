import { Types } from 'mongoose';

export interface TUsername {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface TGuardian {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
}

export interface TLocalGuardian {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
  relationship: string;
}

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TUsername;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian?: TLocalGuardian;
  profileImage?: string;
  admissionSemester: string;
  isDeleted: boolean;
};
