import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Academic department is required!',
    }),
    academicFaculty: z.string({
      required_error: 'Faculty is required!',
    }),
  }),
});
const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Academic department is required!',
      })
      .optional(),
    academicFaculty: z
      .string({
        required_error: 'Faculty is required!',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
