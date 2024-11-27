'use server';

import { db } from '@/lib/db';
import { ClassSchema } from '@/lib/form-validation-schemas';

type ClassInitialState = {
  success: boolean;
  error: boolean;
};

export const createClass = async (
  currentState: ClassInitialState,
  data: ClassSchema
) => {
  const { name, capacity, gradeId, supervisorId } = data;

  try {
    await db.class.create({
      data: {
        name,
        capacity: Number(capacity),
        gradeId,
        supervisorId,
      },
    });

    // revalidatePath('/list/class');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: ClassInitialState,
  data: ClassSchema
) => {
  const { name, capacity, gradeId, supervisorId } = data;
  try {
    await db.class.update({
      where: {
        id: data.id,
      },
      data: {
        name,
        capacity: Number(capacity),
        gradeId,
        supervisorId,
      },
    });

    // revalidatePath('/list/class');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: ClassInitialState,
  data: FormData
) => {
  const id = data.get('id') as string;
  try {
    await db.class.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath('/list/class');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
