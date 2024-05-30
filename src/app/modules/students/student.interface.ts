import { Types } from 'mongoose';

export interface Username {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface Guardian {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
}

export interface LocalGuardian {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
  relationship: string;
}

export type Student = {
  id: string;
  user: Types.ObjectId;
  name: Username;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: Guardian;
  localGuardian?: LocalGuardian;
  profileImage?: string;
  admissionSemester: string;
  isDeleted: boolean;
};
