import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { registrationStatusType } from './semesterRegistration.constant';
import mongoose from 'mongoose';
import { OfferedCourseModel } from '../offeredCourse/offeredCourse.model';

// create a SemesterRegistration
const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload.academicSemester;
  // checking register semester is already exist or not in the SemesterRegistrationModel
  const isSemesterRegistrationExist = await SemesterRegistrationModel.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This semester is already registered!',
    );
  }
  // checking semester is exist or not in the AcademicSemesterModel
  const isAcademicSemesterExist = await AcademicSemesterModel.findOne({
    _id: academicSemester,
  });
  if (!isAcademicSemesterExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This academic semester is not found!',
    );
  }
  // checking any registered semester's status is 'UPCOMING' / 'ONGOING' before creating a new one
  const checkingExistingRegisteredSemesterStatus =
    await SemesterRegistrationModel.findOne({
      $or: [
        { status: registrationStatusType.UPCOMING },
        { status: registrationStatusType.ONGOING },
      ],
    });
  if (checkingExistingRegisteredSemesterStatus) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to create! There is already an ${checkingExistingRegisteredSemesterStatus.status} registered semester!`,
    );
  }

  const result = await SemesterRegistrationModel.create(payload);
  return result;
};

// get all SemesterRegistrations
const getAllSemesterRegistrationFromDB = async () => {
  const result =
    await SemesterRegistrationModel.find().populate('academicSemester');
  return result;
};

// get single SemesterRegistration
const getSingleSemesterRegistrationFromDB = async (id: string) => {
  // checking the id exist or not
  const isSemesterRegistrationExist =
    await SemesterRegistrationModel.findById(id);
  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This registered semester is not exist!',
    );
  }

  const result =
    await SemesterRegistrationModel.findById(id).populate('academicSemester');
  return result;
};

// update a SemesterRegistration
const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // checking the id exist or not
  const isSemesterRegistrationExist =
    await SemesterRegistrationModel.findById(id);
  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This registered semester is not exist!',
    );
  }
  // checking registered semester's status is 'ENDED' or not
  const currentRegisteredSemesterStatus = isSemesterRegistrationExist.status;
  if (currentRegisteredSemesterStatus === registrationStatusType.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to update! This registered semester is already ${currentRegisteredSemesterStatus}!`,
    );
  }
  // checking registered semester's status which can't be updated from 'UPCOMING' to 'ENDED'
  const requestedStatus = payload?.status;
  if (
    currentRegisteredSemesterStatus === registrationStatusType.UPCOMING &&
    requestedStatus === registrationStatusType.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This registered semester can't be updated directly from ${currentRegisteredSemesterStatus} to ${requestedStatus}!`,
    );
  }
  // checking registered semester's status which can't be updated from 'ONGOING' to 'UPCOMING'
  if (
    currentRegisteredSemesterStatus === registrationStatusType.ONGOING &&
    requestedStatus === registrationStatusType.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This registered semester can't be updated reverse-way from ${currentRegisteredSemesterStatus} to ${requestedStatus}!`,
    );
  }

  const result = await SemesterRegistrationModel.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true },
  );
  return result;
};

// delete a SemesterRegistration
const deleteSemesterRegistrationFromDB = async (id: string) => {
  // checking Semester Registration Id is exist or not
  const isSemesterRegistrationExist =
    await SemesterRegistrationModel.findById(id);
  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This registered semester is not exist!',
    );
  }
  // checking Semester Registration's Status is 'UPCOMING' or not. If not, pass error.
  const registeredSemesterStatus = isSemesterRegistrationExist.status;
  if (registeredSemesterStatus !== registrationStatusType.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Registered Semester can't be deleted while status is ${registeredSemesterStatus}!`,
    );
  }

  // create a session
  const session = await mongoose.startSession();
  try {
    // start session
    session.startTransaction();
    // delete offered course of the specific registered semester (Transaction-1)
    const deleteOfferedCourses = await OfferedCourseModel.deleteMany(
      { semesterRegistration: id },
      { session },
    );
    if (!deleteOfferedCourses) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete offered courses which are assigned for a specific registered semester!',
      );
    }
    // delete registered semester (Transaction-2)
    const deleteRegisteredSemester =
      await SemesterRegistrationModel.findByIdAndDelete(id, {
        session,
        new: true,
      });
    if (!deleteRegisteredSemester) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete registered semester!',
      );
    }

    // end session
    await session.commitTransaction();
    await session.endSession();
    return deleteRegisteredSemester;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `error: ${err}`);
  }
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
