import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourseModel } from './offeredCourse.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';
import { hasScheduleConflict } from './offeredCourse.utils';
import { registrationStatusType } from './offeredCourse.constant';
import QueryBuilder from '../../builder/QueryBuilder';

// create an OfferedCourse
const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;

  // checking SemesterRegistration is exist or not
  const isSemesterRegistrationExist =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Registered Semester is not found!',
    );
  }
  // checking AcademicFaculty is exist
  const isAcademicFacultyExist =
    await AcademicFacultyModel.findById(academicFaculty);
  if (!isAcademicFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty is not found!');
  }
  // checking AcademicDepartment is exist or not
  const isAcademicDepartmentExist =
    await AcademicDepartmentModel.findById(academicDepartment);
  if (!isAcademicDepartmentExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Academic Department is not found!',
    );
  }
  // checking Course is exist or not
  const isCourseExist = await CourseModel.findById(course);
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course is not found!');
  }
  // checking Faculty is exist or not
  const isFacultyExist = await FacultyModel.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found!');
  }
  //checking AcademicDepartment is belong to the right AcademicFaculty
  const isDepartmentBelongToAcademicFaculty =
    await AcademicDepartmentModel.findOne({
      academicFaculty: academicFaculty,
      _id: academicDepartment,
    });
  if (!isDepartmentBelongToAcademicFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This ${isAcademicDepartmentExist.name} is not belong to ${isAcademicFacultyExist.name}!`,
    );
  }
  // checking same OfferedCourse is exist with same RegisteredSemester for same RegisteredSection
  const isOfferedCourseExistWithSameRegisteredSemesterForSameSection =
    await OfferedCourseModel.findOne({
      semesterRegistration,
      course,
      section,
    });
  if (isOfferedCourseExistWithSameRegisteredSemesterForSameSection) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to create! This Offered Course is already exist in same Section!`,
    );
  }
  // fixing the schedule of the faculty
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');
  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  if (hasScheduleConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Faculty is not available at this time, please choose other time or day!`,
    );
  }

  // getting AcademicSemester
  const academicSemester = isSemesterRegistrationExist.academicSemester;
  // create a data
  const result = await OfferedCourseModel.create({
    ...payload,
    academicSemester,
  });
  return result;
};

// get all OfferedCourses
const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourseModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fieldLimiting();

  const result = await offeredCourseQuery.queryModel;
  return result;
};

// get single OfferedCourse
const getSingleOfferedCourseFromDB = async (id: string) => {
  // checking OfferedCourse is exist or not
  const isOfferedCourseExist = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course is not found!');
  }

  const result = await OfferedCourseModel.findById(id);
  return result;
};

// update an OfferedCourse
const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  // checking OfferedCourse is exist or not
  const isOfferedCourseExist = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course is not found!');
  }
  // checking Faculty is exist or not
  const isFacultyExist = await FacultyModel.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty is not found!');
  }
  // checking Registered Semester's status is 'UPCOMING' or not. If not, then pass error
  const semesterRegistration = isOfferedCourseExist.semesterRegistration;
  const registeredSemesterStatus =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (registeredSemesterStatus?.status !== registrationStatusType.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course can't be updated while registered semester is ${registeredSemesterStatus?.status}!`,
    );
  }
  // fixing the schedule of the faculty
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');
  const newSchedule = {
    days,
    startTime,
    endTime,
  };
  if (hasScheduleConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Faculty is not available at this time, please choose other time or day!`,
    );
  }

  // update a data
  const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

// delete an OfferedCourse
const deleteOfferedCourseFromDB = async (id: string) => {
  // checking OfferedCourse is exist or not
  const isOfferedCourseExist = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course is not found!');
  }
  // checking Registered Semester's status is 'UPCOMING' or not. If not, then pass error
  const semesterRegistration = isOfferedCourseExist.semesterRegistration;
  const registeredSemesterStatus =
    await SemesterRegistrationModel.findById(semesterRegistration);
  if (registeredSemesterStatus?.status !== registrationStatusType.UPCOMING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course can't be deleted while registered semester is ${registeredSemesterStatus?.status}!`,
    );
  }

  const result = await OfferedCourseModel.findByIdAndDelete(id);
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
};
