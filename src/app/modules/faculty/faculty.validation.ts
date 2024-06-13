import { z } from 'zod';

/*============================ 
create validation schema 
---------------------------*/
const createFacultyNameValidationSchema = z.object({
  firstName: z.string({
    required_error: 'First name is required!',
    invalid_type_error: 'Name must be a string!',
  }),
  middleName: z
    .string({
      invalid_type_error: 'Name must be a string!',
    })
    .optional(),
  lastName: z.string({
    required_error: 'Last name is required!',
    invalid_type_error: 'Name must be a string!',
  }),
});

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().max(16).min(6),
    faculty: z.object({
      name: createFacultyNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      profileImage: z.string().optional(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});
// =============================================================

/*============================ 
update validation schema 
---------------------------*/
const updateFacultyNameValidationSchema = z.object({
  firstName: z
    .string({
      required_error: 'First name is required!',
      invalid_type_error: 'Name must be a string!',
    })
    .optional(),
  middleName: z
    .string({
      invalid_type_error: 'Name must be a string!',
    })
    .optional(),
  lastName: z
    .string({
      required_error: 'Last name is required!',
      invalid_type_error: 'Name must be a string!',
    })
    .optional(),
});

const updateFacultyValidationSchema = z.object({
  body: z.object({
    name: updateFacultyNameValidationSchema.optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dateOfBirth: z.string().optional(),
    email: z.string().email().optional(),
    contactNo: z.string().optional(),
    emergencyContactNo: z.string().optional(),
    bloodGroup: z
      .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
    profileImage: z.string().optional(),
    academicFaculty: z.string().optional(),
    academicDepartment: z.string().optional(),
  }),
});
// =============================================================

export const FacultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
