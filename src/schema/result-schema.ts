// import { z } from 'zod';

// export const resultSchema = z.object({
//   id: z.string().optional(),
//   score: z.coerce.number().optional(),

//   examId: z.string().min(1, {
//     message: 'Exam is required',
//   }),
//   assignmentId: z.string().min(1, {
//     message: 'Assignment is required',
//   }),
//   studentId: z.string().min(1, {
//     message: 'Student is required',
//   }),
// });

// export type ResultSchema = z.infer<typeof resultSchema>;

// In your schema/result-schema.ts file
import { z } from 'zod';

export const resultSchema = z
  .object({
    id: z.string().optional(),
    score: z.coerce
      .number()
      .min(0, { message: 'Score must be at least 0' })
      .max(100, { message: 'Score cannot exceed 100' }),
    studentId: z.string().min(1, { message: 'Student must be selected' }),
    assignmentId: z.string().optional(),
    examId: z.string().optional(),
    resType: z.enum(['exam', 'assignment'], {
      errorMap: () => ({ message: 'Please select a valid type' }),
    }),
  })
  .refine(
    (data) => {
      if (data.resType === 'exam') {
        return !!data.examId;
      }
      if (data.resType === 'assignment') {
        return !!data.assignmentId;
      }
      return false;
    },
    {
      message: 'Please select an exam or assignment',
      path: ['examId', 'assignmentId'],
    }
  );

export type ResultSchema = z.infer<typeof resultSchema>;
