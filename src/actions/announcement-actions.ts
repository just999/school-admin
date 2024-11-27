'use server';

import { db } from '@/lib/db';
import { getUserRoleAndId } from '@/lib/get-user-role';
import { AnnouncementSchema } from '@/schema/announcement-schema';

type AnnouncementInitialState = {
  success: boolean;
  error: boolean;
  message?: '';
};

export const createAnnouncement = async (
  currentState: AnnouncementInitialState,
  data: AnnouncementSchema
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
          id: data.classId,
        },
      });

      if (!teacherLesson) {
        return { success: false, error: true };
      }
    }

    await db.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data.classId,
      },
    });

    // revalidatePath('/list/announcements');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (
  currentState: AnnouncementInitialState,
  data: AnnouncementSchema
) => {
  const { userId, role } = await getUserRoleAndId();
  const teacher = await db.teacher.findFirst({
    where: {
      teacherClerkId: userId,
    },
  });
  try {
    // if (role === 'teacher') {
    //   const teacherClass = await db.class.findFirst({
    //     where: {
    //       teacherId: teacher?.id,
    //       id: data.classId,
    //     },
    //   });

    //   if (!teacherClass) {
    //     return { success: false, error: true };
    //   }
    // }

    await db.announcement
      .update({
        where: {
          id: data.id,
        },
        data: {
          title: data.title,
          description: data.description,
          date: data.date,
          classId: data.classId.toString(),
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
    // revalidatePath('/list/announcements');
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

export const deleteAnnouncement = async (
  currentState: AnnouncementInitialState,
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
    await db.announcement.delete({
      where: {
        id: id,
        ...(role === 'teacher' ? { lesson: { teacherId: teacher?.id! } } : {}),
      },
    });

    // revalidatePath('/list/announcements');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
