import { z } from 'zod';

export const attendanceSchema = z.object({
  id: z.string().optional(),
  date: z.coerce.date({ message: 'date is required' }),
  present: z.boolean().optional(),
  studentId: z.string().min(1, {
    message: 'Student id is required',
  }),
  lessonId: z.string().min(1, {
    message: 'Lesson is required',
  }),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;
