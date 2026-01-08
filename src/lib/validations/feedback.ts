import { z } from 'zod';

// Feedback type enum
export const feedbackTypeEnum = z.enum(['feature', 'bug']);

// Visitor feedback submission schema (with captcha)
export const visitorFeedbackSchema = z.object({
  type: feedbackTypeEnum,
  description: z
    .string()
    .min(20, 'Please provide more detail (at least 20 characters)')
    .max(2000, 'Description must be 2000 characters or less'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be 255 characters or less')
    .optional()
    .or(z.literal('')),
  captchaAnswer: z.string().min(1, 'Please solve the math problem'),
  captchaToken: z.string().min(1, 'Invalid captcha'),
  // Honeypot field - should be empty
  website: z.string().max(0, 'Bot detected').optional().or(z.literal('')),
});

// Admin feedback schema (for status updates)
export const adminFeedbackSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'resolved', 'dismissed']),
  adminNotes: z.string().max(1000, 'Notes must be 1000 characters or less').optional().or(z.literal('')),
});

export type VisitorFeedbackFormData = z.infer<typeof visitorFeedbackSchema>;
export type AdminFeedbackFormData = z.infer<typeof adminFeedbackSchema>;
export type FeedbackType = z.infer<typeof feedbackTypeEnum>;
