import { z } from 'zod';
import { Month, SemesterCode, SemesterName } from './academicSemester.constant';

const createAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...SemesterName] as [string, ...string[]]),
    year: z.string(),
    code: z.enum([...SemesterCode] as [string, ...string[]]),
    startMonth: z.enum([...Month] as [string, ...string[]]),
    endMonth: z.enum([...Month] as [string, ...string[]]),
  }),
});
const updateAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...SemesterName] as [string, ...string[]]).optional(),
    year: z.string().optional(),
    code: z.enum([...SemesterCode] as [string, ...string[]]).optional(),
    startMonth: z.enum([...Month] as [string, ...string[]]).optional(),
    endMonth: z.enum([...Month] as [string, ...string[]]).optional(),
  }),
});

export const AcademicSemesterValidation = {
  createAcademicSemesterValidationSchema,
  updateAcademicSemesterValidationSchema,
};
