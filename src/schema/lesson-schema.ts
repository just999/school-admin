import { z } from 'zod';

export const lessonSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, {
    message: 'lesson title is required!',
  }),
  day: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], {
    message: 'day is required',
  }),
  startTime: z.coerce.date({ message: 'Start time is required' }),
  endTime: z.coerce.date({ message: 'End time is required' }),
  subjectId: z.string().min(1, {
    message: 'Subject is required',
  }),
  classId: z.string().min(1, {
    message: 'Class is required',
  }),
  teacherId: z.string().min(1, {
    message: 'Teacher is required',
  }),
});

export type LessonSchema = z.infer<typeof lessonSchema>;
