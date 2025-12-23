import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  price: z.string().refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
    'Price must be a valid positive number'
  ),
});

export const eventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(255),
  raceDate: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Valid race date is required'
  ),
  location: z.string().min(1, 'Location is required').max(255),
  registrationLink: z.string().url('Invalid URL').optional().or(z.literal('')),
  paymentDeadline: z.string().optional().or(z.literal('')),
  categories: z.array(categorySchema).min(1, 'At least one category is required'),
});

export type EventFormData = z.infer<typeof eventSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
