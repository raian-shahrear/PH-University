import { z } from 'zod';

// create validation schema
const createAdminNameValidationSchema = z.object({
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

const createAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().max(16).min(6),
    admin: z.object({
      designation: z.string(),
      name: createAdminNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      profileImage: z.string().optional(),
      managementDepartment: z.string(),
    }),
  }),
});
// ========================================================

// update validation schema
const updateAdminNameValidationSchema = z.object({
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

const updateAdminValidationSchema = z.object({
  body: z.object({
    designation: z.string().optional(),
    name: updateAdminNameValidationSchema.optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    dateOfBirth: z.string().optional(),
    email: z.string().email().optional(),
    contactNo: z.string().optional(),
    emergencyContactNo: z.string().optional(),
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
    profileImage: z.string().optional(),
    managementDepartment: z.string().optional(),
  }),
});
// ========================================================

export const AdminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
