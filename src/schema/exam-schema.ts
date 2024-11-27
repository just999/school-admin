import { z } from 'zod';

export const examSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, {
    message: 'exam title is required!',
  }),
  startTime: z.coerce.date({ message: 'Start time is required' }),
  endTime: z.coerce.date({ message: 'End time is required' }),
  lessonId: z.string().min(1, {
    message: 'Lesson is required',
  }),
});

export type ExamSchema = z.infer<typeof examSchema>;
