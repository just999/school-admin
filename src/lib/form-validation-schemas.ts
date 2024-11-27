import { z } from 'zod';

export const subjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, {
    message: 'subject name is required!',
  }),
  teachers: z.array(z.string()),
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, {
    message: 'class name is required!',
  }),
  capacity: z.coerce.number().min(1, {
    message: 'Capacity is required',
  }),
  gradeId: z.string().min(1, {
    message: 'Grade id is required',
  }),
  supervisorId: z.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  teacherClerkId: z.string().optional(),
  username: z
    .string()
    .min(3, {
      message: 'at least 3 characters',
    })
    .max(20, {
      message: 'max length is 20 characters',
    }),
  password: z
    .string()
    .min(4, {
      message: 'At least 4 characters',
    })
    .optional()
    .or(z.literal('')),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  surname: z.string().min(1, {
    message: 'SurName is required',
  }),
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, {
    message: 'bloodType is required',
  }),
  birthday: z.coerce.date({
    message: 'birthday is required',
  }),
  sex: z.enum(['MALE', 'FEMALE'], { message: 'Sex is required' }),
  subjects: z.array(z.string()).optional(), // ?subject ids
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

// Helper function to check if date is valid and not in the future
// const isPastDate = (date: Date) => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   return date <= today;
// };

// // Helper to check if person is at least 18 years old
// const isAtLeastAge = (date: Date, minAge: number) => {
//   const today = new Date();
//   const birthDate = new Date(date);
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();

//   if (
//     monthDiff < 0 ||
//     (monthDiff === 0 && today.getDate() < birthDate.getDate())
//   ) {
//     age--;
//   }

//   return age >= minAge;
// };

// export const teacherSchema = z.object({
//   id: z.string().optional(),
//   teacherClerkId: z.string().optional(),
//   username: z
//     .string()
//     .min(3, { message: 'at least 3 characters' })
//     .max(20, { message: 'max length is 20 characters' }),
//   password: z.string().min(8, {
//     message: 'At least 8 characters',
//   }),
//   name: z.string().min(1, {
//     message: 'Name is required',
//   }),
//   surname: z.string().min(1, {
//     message: 'SurName is required',
//   }),
//   email: z
//     .string()
//     .email({ message: 'Invalid email' })
//     .optional()
//     .or(z.literal('')),
//   phone: z.string().optional(),
//   address: z.string(),
//   img: z.string().optional(),
//   bloodType: z.string().min(1, {
//     message: 'bloodType is required',
//   }),
//   birthday: z.coerce
//     .date({
//       required_error: 'Birthday is required',
//       invalid_type_error: 'Birthday must be a valid date',
//     })
//     .refine((date) => !isNaN(date.getTime()), {
//       message: 'Invalid date format',
//     })
//     .refine(isPastDate, {
//       message: 'Birthday cannot be in the future',
//     })
//     .refine((date) => isAtLeastAge(date, 18), {
//       message: 'Teacher must be at least 18 years old',
//     }),
//   sex: z.enum(['MALE', 'FEMALE'], { message: 'Sex is required' }),
//   subjects: z.array(z.string()).optional(), // subject ids
// });

// export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  studentClerkId: z.string().optional(),
  username: z
    .string()
    .min(3, {
      message: 'at least 3 characters',
    })
    .max(20, {
      message: 'max length is 20 characters',
    }),
  password: z
    .string()
    .min(4, {
      message: 'At least 4 characters',
    })
    .optional()
    .or(z.literal('')),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  surname: z.string().min(1, {
    message: 'SurName is required',
  }),
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, {
    message: 'bloodType is required',
  }),
  birthday: z.coerce.date({
    message: 'birthday is required',
  }),
  sex: z.enum(['MALE', 'FEMALE'], { message: 'Sex is required' }),
  gradeId: z.string().min(1, { message: 'Grade is required...' }),
  classId: z.string().min(1, { message: 'Class is required...' }),
  parentId: z.string().min(1, { message: 'Parent id is required...' }),
});

export type StudentSchema = z.infer<typeof studentSchema>;
