import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCourse, TCourseFaculty } from './course.interface';
import { CourseFacultyModel, CourseModel } from './course.model';
import QueryBuilder from '../../builder/QueryBuilder';
import mongoose from 'mongoose';

// create a course
const createCourseIntoDB = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

// get all courses
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const searchableField = ['title', 'prefix', 'code'];
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(searchableField)
    .filter()
    .sort()
    .paginate()
    .fieldLimiting();
  const result = await courseQuery.queryModel;
  return result;
};

// get single course
const getSingleCourseFromDB = async (id: string) => {
  // checking the id exist or not
  const isCourseExist = await CourseModel.findById(id);
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This course is not exist!');
  }

  const result = await CourseModel.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

// delete a course
const deleteCourseFromDB = async (id: string) => {
  // checking the id exist or not
  const isCourseExist = await CourseModel.findById(id);
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This course is not exist!');
  }

  const result = await CourseModel.findByIdAndUpdate(
    id,
    { $set: { isDeleted: true } },
    { new: true },
  );
  return result;
};

// update a course
const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  // checking the id exist or not
  const isCourseExist = await CourseModel.findById(id);
  if (!isCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This course is not exist!');
  }

  const { preRequisiteCourses, ...remainingCourseData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // step-1: update course basic info
    const updateBasicCourseInfo = await CourseModel.findByIdAndUpdate(
      id,
      remainingCourseData,
      { new: true, runValidators: true, session },
    );
    if (!updateBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
    }

    // step-2: check then update preRequisiteCourses
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // delete preRequisiteCourses
      const findDeletedPreRequisites = preRequisiteCourses
        .filter((elm) => elm.course && elm.isDeleted)
        .map((elm) => elm.course);
      const deletedPreRequisitesFromArray = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: findDeletedPreRequisites } },
          },
        },
        { new: true, runValidators: true, session },
      );
      if (!deletedPreRequisitesFromArray) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
      }

      // add preRequisiteCourses
      const findNewlyAddedPreRequisites = preRequisiteCourses.filter(
        (elm) => elm.course && !elm.isDeleted,
      );
      const addedPreRequisitesIntoArray = await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisiteCourses: { $each: findNewlyAddedPreRequisites },
          },
        },
        { new: true, runValidators: true, session },
      );
      if (!addedPreRequisitesIntoArray) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!');
      }
    }

    await session.commitTransaction();
    await session.endSession();
    const result = await CourseModel.findById(id).populate(
      'preRequisiteCourses.course',
    );
    return result;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, `error: ${err}`);
  }
};

// assign faculties for a course
const assignFacultiesForCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    { upsert: true, new: true },
  );
  return result;
};

// remove faculties for a course
const removeFacultiesFormCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    { new: true },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
  updateCourseIntoDB,
  assignFacultiesForCourseIntoDB,
  removeFacultiesFormCourseFromDB,
};
