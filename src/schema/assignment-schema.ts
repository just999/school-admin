import { z } from 'zod';

export const assignmentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, {
    message: 'assignment title is required!',
  }),
  startDate: z.coerce.date({ message: 'Start date is required' }),
  dueDate: z.coerce.date({ message: 'Due date is required' }),
  lessonId: z.string().min(1, {
    message: 'Lesson is required',
  }),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;
