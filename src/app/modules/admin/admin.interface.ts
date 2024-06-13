import { Types } from 'mongoose';

export interface TAdminName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export type TAdmin = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TAdminName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  presentAddress: string;
  permanentAddress: string;
  profileImage?: string;
  managementDepartment: string;
  isDeleted: boolean;
};
