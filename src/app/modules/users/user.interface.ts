import { Model } from 'mongoose';
import { user_role } from './user.constant';

export interface TUser {
  id: string;
  password: string;
  needsPassChange: boolean;
  role: 'admin' | 'student' | 'faculty';
  status: 'active' | 'blocked';
  passwordChangedAt?: Date;
  isDeleted: boolean;
}

export type TUserRole = keyof typeof user_role;

export interface UserStaticModel extends Model<TUser> {
  // instance for checking valid id
  isUserExistByCustomId(id: string): Promise<TUser>;
  // instance for matching password
  isPasswordMatched(
    planeTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
