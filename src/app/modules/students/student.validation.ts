import { z } from 'zod';

const userNameValidationSchema = z.object({
  firstName: z.string({
    required_error: 'First name is required!',
    invalid_type_error: 'Name must be a string!',
  }),
  middleName: z.string({
    invalid_type_error: 'Name must be a string!',
  }),
  lastName: z.string({
    required_error: 'Last name is required!',
    invalid_type_error: 'Name must be a string!',
  }),
});

const guardianValidationSchema = z.object({
  fatherName: z.string({
    required_error: 'Father name is required!',
    invalid_type_error: 'Name must be a string!',
  }),
  fatherOccupation: z.string({
    required_error: 'Father occupation is required!',
    invalid_type_error: 'Occupation must be a string!',
  }),
  fatherContactNo: z.string({
    required_error: 'Father contact no is required!',
    invalid_type_error: 'Contact no must be a string!',
  }),
  motherName: z.string({
    required_error: 'Mother name is required!',
    invalid_type_error: 'Name must be a string!',
  }),
  motherOccupation: z.string({
    required_error: 'Mother occupation no is required!',
    invalid_type_error: 'Occupation must be a string!',
  }),
  motherContactNo: z.string({
    required_error: 'Mother contact no is required!',
    invalid_type_error: 'Contact no must be a string!',
  }),
});

const localGuardianValidationSchema = z.object({
  name: z.string({
    required_error: 'L. guardian Name is required!',
    invalid_type_error: 'Name must be a string!',
  }),
  occupation: z.string({
    required_error: 'L. guardian Occupation is required!',
    invalid_type_error: 'Occupation must be a string!',
  }),
  contactNo: z.string({
    required_error: 'L. guardian Contact no is required!',
    invalid_type_error: 'Contact no must be a string!',
  }),
  address: z.string({
    required_error: 'L. guardian address is required!',
    invalid_type_error: 'Address must be a string!',
  }),
  relationship: z.string({
    required_error: 'L. guardian relationship is required!',
    invalid_type_error: 'Relationship must be a string!',
  }),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(16).min(6),
    student: z.object({
      name: userNameValidationSchema,
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
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema.optional(),
      profileImage: z.string().optional(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
};
