'use server';

import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { ExamSchema } from '@/schema/exam-schema';

type ExamInitialState = {
  success: boolean;
  error: boolean;
  message?: '';
};

export const createExam = async (
  currentState: ExamInitialState,
  data: ExamSchema
) => {
  const { userId, role } = await getUserRoleAndId();

  const teacher = await db.teacher.findFirst({
    where: {
      teacherClerkId: userId,
    },
  });
  try {
    if (role === 'teacher') {
      const teacherLesson = await db.lesson.findFirst({
        where: {
          teacherId: teacher?.id,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await db.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath('/list/exams');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: ExamInitialState,
  data: ExamSchema
) => {
  const { userId, role } = await getUserRoleAndId();
  const teacher = await db.teacher.findFirst({
    where: {
      teacherClerkId: userId,
    },
  });
  try {
    if (role === 'teacher') {
      const teacherLesson = await db.lesson.findFirst({
        where: {
          teacherId: teacher?.id,
          id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await db.exam
      .update({
        where: {
          id: data.id,
        },
        data: {
          title: data.title,
          startTime: data.startTime,
          endTime: data.endTime,
          lessonId: data.lessonId.toString(),
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
    // revalidatePath('/list/exams');
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

export const deleteExam = async (
  currentState: ExamInitialState,
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
    await db.exam.delete({
      where: {
        id: id,
        ...(role === 'teacher' ? { lesson: { teacherId: teacher?.id! } } : {}),
      },
    });

    // revalidatePath('/list/exams');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
