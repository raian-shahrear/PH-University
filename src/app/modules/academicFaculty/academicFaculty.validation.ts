import { z } from 'zod';

const createAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Academic faculty is required!',
    }),
  }),
});
const updateAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Academic faculty is required!',
    }),
  }),
});

export const AcademicFacultyValidations = {
  createAcademicFacultyValidationSchema,
  updateAcademicFacultyValidationSchema,
};
