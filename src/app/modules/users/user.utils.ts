import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { UserModel } from './user.model';

// create student ID
const findLastStudentId = async () => {
  const lastStudent = await UserModel.findOne(
    { role: 'student' },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  //   2026 01 0001
  return lastStudent?.id ? lastStudent.id : undefined;
};
export const generatedStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString(); // 0000
  // 2026 01 0001
  const lastStudentId = await findLastStudentId();
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6); // 01
  const lastStudentSemesterYear = lastStudentId?.substring(0, 4); // 2026
  const currentSemesterCode = payload.code;
  const currentSemesterYear = payload.year;
  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentSemesterYear === currentSemesterYear
  ) {
    currentId = lastStudentId.substring(6); // 0001
  }

  // increment id last 4 digits
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};

// Create Admin ID
const findLastAdminId = async () => {
  const lastAdmin = await UserModel.findOne(
    { role: 'admin' },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  //   A-0001
  return lastAdmin?.id ? lastAdmin.id : undefined;
};
export const generatedAdminId = async () => {
  let currentId = (0).toString(); // 0000
  const lastAdminId = await findLastAdminId();
  if (lastAdminId) {
    currentId = lastAdminId.substring(2); // 0001
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `A-${incrementId}`;
  return incrementId;
};

// Create Admin ID
const findLastFacultyId = async () => {
  const lastFaculty = await UserModel.findOne(
    { role: 'faculty' },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  //   A-0001
  return lastFaculty?.id ? lastFaculty.id : undefined;
};
export const generatedFacultyId = async () => {
  let currentId = (0).toString(); // 0000
  const lastFacultyId = await findLastFacultyId();
  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2); // 0001
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `F-${incrementId}`;
  return incrementId;
};
