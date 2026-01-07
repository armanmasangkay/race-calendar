import { z } from 'zod';

// Admin queue item schema
export const queueItemSchema = z.object({
  url: z.string().min(1, 'URL is required').url('Please enter a valid URL'),
  title: z.string().max(255, 'Title must be 255 characters or less').optional().or(z.literal('')),
  notes: z.string().max(500, 'Notes must be 500 characters or less').optional().or(z.literal('')),
});

// Visitor submission schema (with captcha)
export const visitorSubmissionSchema = z.object({
  url: z.string().min(1, 'URL is required').url('Please enter a valid URL'),
  title: z.string().min(1, 'Event title is required').max(255, 'Title must be 255 characters or less'),
  captchaAnswer: z.string().min(1, 'Please solve the math problem'),
  captchaToken: z.string().min(1, 'Invalid captcha'),
  // Honeypot field - should be empty
  website: z.string().max(0, 'Bot detected').optional().or(z.literal('')),
});

export type QueueItemFormData = z.infer<typeof queueItemSchema>;
export type VisitorSubmissionFormData = z.infer<typeof visitorSubmissionSchema>;
