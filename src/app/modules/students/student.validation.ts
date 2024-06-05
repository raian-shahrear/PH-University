import { z } from 'zod';

/*============================ 
create validation schema 
---------------------------*/
const createUserNameValidationSchema = z.object({
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

const createGuardianValidationSchema = z.object({
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

const createLocalGuardianValidationSchema = z.object({
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
      name: createUserNameValidationSchema,
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
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema.optional(),
      profileImage: z.string().optional(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
    }),
  }),
});
// =============================================================

/*============================ 
update validation schema 
---------------------------*/
const updateUserNameValidationSchema = z.object({
  firstName: z
    .string({
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
      invalid_type_error: 'Name must be a string!',
    })
    .optional(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z
    .string({
      invalid_type_error: 'Name must be a string!',
    })
    .optional(),
  fatherOccupation: z
    .string({
      invalid_type_error: 'Occupation must be a string!',
    })
    .optional(),
  fatherContactNo: z
    .string({
      invalid_type_error: 'Contact no must be a string!',
    })
    .optional(),
  motherName: z
    .string({
      invalid_type_error: 'Name must be a string!',
    })
    .optional(),
  motherOccupation: z
    .string({
      invalid_type_error: 'Occupation must be a string!',
    })
    .optional(),
  motherContactNo: z
    .string({
      invalid_type_error: 'Contact no must be a string!',
    })
    .optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Name must be a string!',
    })
    .optional(),
  occupation: z
    .string({
      invalid_type_error: 'Occupation must be a string!',
    })
    .optional(),
  contactNo: z
    .string({
      invalid_type_error: 'Contact no must be a string!',
    })
    .optional(),
  address: z
    .string({
      invalid_type_error: 'Address must be a string!',
    })
    .optional(),
  relationship: z
    .string({
      invalid_type_error: 'Relationship must be a string!',
    })
    .optional(),
});

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameValidationSchema.optional(),
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
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      profileImage: z.string().optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});
// ===================================================================

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
