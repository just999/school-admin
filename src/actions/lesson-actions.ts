'use server';

import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { LessonSchema } from '@/schema/lesson-schema';

type LessonInitialState = {
  success: boolean;
  error: boolean;
  message?: '';
};

export const createLesson = async (
  currentState: LessonInitialState,
  data: LessonSchema
) => {
  const { userId, role } = await getUserRoleAndId();

  const teacher = await db.teacher.findFirst({
    where: {
      teacherClerkId: userId,
    },
  });
  try {
    if (role !== 'admin') {
      return { success: false, error: true, message: 'not authorized' };
    }

    await db.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    });

    // revalidatePath('/list/lessons');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateLesson = async (
  currentState: LessonInitialState,
  data: LessonSchema
) => {
  const { userId, role } = await getUserRoleAndId();
  try {
    if (role !== 'admin') {
      return { success: false, error: true };
    }

    await db.lesson
      .update({
        where: {
          id: data.id,
        },
        data: {
          name: data.name,
          day: data.day,
          startTime: data.startTime,
          endTime: data.endTime,
          subjectId: data.subjectId,
          classId: data.classId,
          teacherId: data.teacherId,
        },
      })
      .catch((error) => {
        console.error('Database creation error:', error);
        // If database creation fails, we should delete the Clerk user
        // client.users
        //   .deleteUser(user.id)
        //   .catch((e: any) =>
        //     console.error(
        //       'Failed to delete Clerk user after database error:',
        //       e
        //     )
        //   );
        throw error;
      });
    // revalidatePath('/list/lessons');
    return {
      success: true,
      error: false,
      message: 'Student updated successfully',
    };
  } catch (err: any) {
    console.log(err);

    // More specific error handling
    if (err.errors && Array.isArray(err.errors)) {
      const errorMessages = err.errors
        .map((e: any) => e.message || e.longMessage)
        .join(', ');
      return {
        success: false,
        error: true,
        message: `Validation failed: ${errorMessages}`,
      };
    }

    // Handle specific Clerk errors
    if (err?.status === 422) {
      return {
        success: false,
        error: true,
        message:
          'Invalid input: Please check username and password requirements',
      };
    }

    return {
      success: false,
      error: true,
      message: err.message || 'Failed to update student. Please try again.',
    };
  }
};

export const deleteLesson = async (
  currentState: LessonInitialState,
  data: FormData
) => {
  const { userId, role } = await getUserRoleAndId();

  const teacher = await db.teacher.findFirst({
    where: {
      teacherClerkId: userId,
    },
  });
  const id = data.get('id') as string;
  try {
    await db.lesson.delete({
      where: {
        id: id,
        ...(role === 'teacher' ? { lesson: { teacherId: teacher?.id! } } : {}),
      },
    });

    // revalidatePath('/list/lessons');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
