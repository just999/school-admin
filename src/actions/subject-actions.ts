'use server';

import { db } from '@/lib/db';
import { SubjectSchema } from '@/lib/form-validation-schemas';

type SubjectInitialState = {
  success: boolean;
  error: boolean;
  message?: '';
};

export const createSubject = async (
  currentState: SubjectInitialState,
  data: SubjectSchema
) => {
  try {
    await db.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath('/list/subjects');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: SubjectInitialState,
  data: SubjectSchema
) => {
  try {
    await db.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({
            id: teacherId,
          })),
        },
      },
    });

    // revalidatePath('/list/subjects');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: SubjectInitialState,
  data: FormData
) => {
  const id = data.get('id') as string;
  try {
    await db.subject.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath('/list/subjects');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
