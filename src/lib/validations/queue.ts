import { z } from 'zod';

export const queueItemSchema = z.object({
  url: z.string().min(1, 'URL is required').url('Please enter a valid URL'),
  notes: z.string().max(500, 'Notes must be 500 characters or less').optional().or(z.literal('')),
});

export type QueueItemFormData = z.infer<typeof queueItemSchema>;
