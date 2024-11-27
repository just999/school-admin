'use server';

import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { resultSchema, ResultSchema } from '@/schema/result-schema';

type ResultInitialState = {
  success: boolean;
  error: boolean;
  message?: '';
};

export const createResult = async (
  currentState: ResultInitialState,
  data: ResultSchema
) => {
  const { userId, role } = await getUserRoleAndId();

  const teacher = await db.teacher.findFirst({
    where: {
      teacherClerkId: userId,
    },
  });
  try {
    const validatedData = resultSchema.parse(data);
    if (role === 'teacher') {
      const teacherLesson = await db.lesson.findFirst({
        where: {
          teacherId: teacher?.id,
          // id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await db.result.create({
      data: {
        score: validatedData.score,
        studentId: validatedData.studentId,
        // Depending on your Prisma schema, you might need to handle this differently
        ...(validatedData.resType === 'exam'
          ? { examId: validatedData.examId, assignmentId: null }
          : { examId: null, assignmentId: validatedData.assignmentId }),
      },
    });

    // revalidatePath('/list/results');
    return {
      success: true,
      error: false,
      message: 'Result created successfully',
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: true,
      message: 'Failed to create result',
    };
  }
};

export const updateResult = async (
  currentState: ResultInitialState,
  data: ResultSchema
) => {
  const { userId, role } = await getUserRoleAndId();
  const teacher = await db.teacher.findFirst({
    where: {
      teacherClerkId: userId,
    },
  });
  try {
    const validatedData = resultSchema.parse(data);
    if (role === 'teacher') {
      const teacherLesson = await db.lesson.findFirst({
        where: {
          teacherId: teacher?.id,
          // id: data.lessonId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    const result = await db.result.update({
      where: { id: validatedData.id },
      data: {
        score: validatedData.score,
        studentId: validatedData.studentId,
        ...(validatedData.resType === 'exam'
          ? { examId: validatedData.examId, assignmentId: null }
          : { assignmentId: validatedData.assignmentId, examId: null }),
      },
    });

    // await db.result
    //   .update({
    //     where: {
    //       id: data.id,
    //     },
    //     data: {
    //       title: data.title,
    //       startDate: data.startDate,
    //       dueDate: data.dueDate,
    //       lessonId: data.lessonId,
    //     },
    //   })
    //   .catch((error) => {
    //     console.error('Database creation error:', error);

    //     throw error;
    //   });
    // revalidatePath('/list/results');
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

export const deleteResult = async (
  currentState: ResultInitialState,
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
    await db.result.delete({
      where: {
        id: id,
        ...(role === 'teacher' ? { lesson: { teacherId: teacher?.id! } } : {}),
      },
    });

    // revalidatePath('/list/results');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
