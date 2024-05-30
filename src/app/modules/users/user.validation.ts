import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be a string' })
    .max(16, { message: "Password can't be more than 16 characters" })
    .min(6, { message: 'Password must be at least 6 characters' })
    .optional(),
});

export default userValidationSchema;
