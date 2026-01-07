import { z } from 'zod';

export const allowedEmailSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase(),
});

export type AllowedEmailFormData = z.infer<typeof allowedEmailSchema>;
