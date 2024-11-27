import { z } from 'zod';

export const eventSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, {
    message: 'event title is required!',
  }),
  description: z.string().min(1, {
    message: 'event title is required!',
  }),
  startTime: z.coerce.date({ message: 'startTime is required' }),
  endTime: z.coerce.date({ message: 'endTime is required' }),
  classId: z.string().optional(),
});

export type EventSchema = z.infer<typeof eventSchema>;
