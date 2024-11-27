import { z } from 'zod';

export const announcementSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, {
    message: 'announcement title is required!',
  }),
  description: z.string().min(1, {
    message: 'announcement title is required!',
  }),
  date: z.coerce.date({ message: 'date is required' }),
  classId: z.string().min(1, {
    message: 'Lesson is required',
  }),
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;
