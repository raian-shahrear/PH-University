import { z } from 'zod';
import { daysArray } from './offeredCourse.constant';

const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  },
  { message: "Invalid time formate! Expected 'HH:MM' in 24 hours formate." },
);

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      section: z.number(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...daysArray] as [string, ...string[]])),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        // endTime must be bigger than statTime
        const start = new Date(`1971-01-01T${body.startTime}:00`);
        const end = new Date(`1971-01-01T${body.endTime}:00`);
        return end > start;
      },
      { message: 'End Time must be bigger than Stat Time!' },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...daysArray] as [string, ...string[]])),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        // endTime must be bigger than statTime
        const start = new Date(`1971-01-01T${body.startTime}:00`);
        const end = new Date(`1971-01-01T${body.endTime}:00`);
        return end > start;
      },
      { message: 'End Time must be bigger than Stat Time!' },
    ),
});
export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
