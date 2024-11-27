import { z } from 'zod';

export const parentSchema = z.object({
  id: z.string().optional(),
  parentClerkId: z.string().optional(),
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
});

export type ParentSchema = z.infer<typeof parentSchema>;
