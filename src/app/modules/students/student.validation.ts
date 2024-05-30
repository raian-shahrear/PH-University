import { z } from 'zod';

const studentValidationSchema = z.object({
  id: z.string(),
});

export default studentValidationSchema;
