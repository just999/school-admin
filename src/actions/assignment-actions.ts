'use server';

import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { AssignmentSchema } from '@/schema/assignment-schema';

type AssignmentInitialState = {
  success: boolean;
  error: boolean;
  message?: '';
};

export const createAssignment = async (
  currentState: AssignmentInitialState,
  data: AssignmentSchema
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

    await db.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath('/list/assignments');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: AssignmentInitialState,
  data: AssignmentSchema
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

    await db.assignment
      .update({
        where: {
          id: data.id,
        },
        data: {
          title: data.title,
          startDate: data.startDate,
          dueDate: data.dueDate,
          lessonId: data.lessonId,
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
    // revalidatePath('/list/assignments');
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

export const deleteAssignment = async (
  currentState: AssignmentInitialState,
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
    await db.assignment.delete({
      where: {
        id: id,
        ...(role === 'teacher' ? { lesson: { teacherId: teacher?.id! } } : {}),
      },
    });

    // revalidatePath('/list/assignments');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
