import { Schema, model } from 'mongoose';
import { TUser, UserStaticModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserStaticModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPassChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    passwordChangedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// encrypt password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

//id validation using static method
userSchema.statics.isUserExistByCustomId = async function (id) {
  return await UserModel.findOne({ id }).select('+password');
};
//password matching using static method
userSchema.statics.isPasswordMatched = async function (
  planeTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(planeTextPassword, hashedPassword);
};

export const UserModel = model<TUser, UserStaticModel>('User', userSchema);
