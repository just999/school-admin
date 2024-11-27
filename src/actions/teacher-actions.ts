'use server';

import { db } from '@/lib/db';
import { TeacherSchema } from '@/lib/form-validation-schemas';
import { clerkClient } from '@clerk/nextjs/server';

export type TeacherInitialState = {
  success: boolean;
  error: boolean;
  message?: string;
};

export const createTeacher = async (
  currentState: TeacherInitialState,
  formData: TeacherSchema
): Promise<TeacherInitialState> => {
  try {
    const client = await clerkClient();
    // Debug log the incoming data
    console.log('Creating teacher with data:', {
      username: formData.username,
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
    });

    // Check if username exists in database first
    const existingTeacher = await db.teacher.findFirst({
      where: {
        username: formData.username,
      },
    });

    if (existingTeacher) {
      console.log('Teacher already exists in database:', existingTeacher);
      return {
        success: false,
        error: true,
        message: 'Username already exists in database',
      };
    }

    // Create user in Clerk first
    const user = await client.users
      .createUser({
        username: formData.username,
        password: formData.password,
        firstName: formData.name,
        lastName: formData.surname,
        ...(formData.email
          ? {
              emailAddresses: [
                {
                  emailAddress: formData.email,
                  primary: true,
                },
              ],
            }
          : {}),
        publicMetadata: {
          role: 'teacher',
          birthday: formData.birthday.toISOString(),
          bloodType: formData.bloodType,
          sex: formData.sex,
        },
      })
      .catch((error: any) => {
        console.error('Clerk createUser error:', error);
        if (error.errors) {
          console.log('Clerk error details:', error.errors);
        }
        throw error;
      });

    console.log('User created in Clerk:', user.id);

    // Create teacher in database
    const teacher = await db.teacher
      .create({
        data: {
          teacherClerkId: user.id,
          username: formData.username,
          name: formData.name,
          surname: formData.surname,
          email: formData.email || '',
          phone: formData.phone || '',
          address: formData.address,
          img: formData.img || '',
          bloodType: formData.bloodType,
          sex: formData.sex,
          birthday: formData.birthday,
          subjects: formData.subjects?.length
            ? {
                connect: formData.subjects.map((subjectId: string) => ({
                  id: subjectId,
                })),
              }
            : undefined,
        },
      })
      .catch((error) => {
        console.error('Database creation error:', error);
        // If database creation fails, we should delete the Clerk user
        client.users
          .deleteUser(user.id)
          .catch((e: any) =>
            console.error(
              'Failed to delete Clerk user after database error:',
              e
            )
          );
        throw error;
      });

    console.log('Teacher created in database:', teacher.id);

    return {
      success: true,
      error: false,
      message: 'Teacher created successfully',
    };
  } catch (err: any) {
    console.error('Error in createTeacher:', err);

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
      message: err.message || 'Failed to create teacher. Please try again.',
    };
  }
};

export const updateTeacher = async (
  currentState: TeacherInitialState,
  formData: TeacherSchema
) => {
  if (!formData.teacherClerkId) {
    return { success: false, error: true };
  }
  try {
    const client = await clerkClient();
    const user = await client.users
      .updateUser(formData?.teacherClerkId, {
        username: formData.username,
        ...(formData.password !== '' && { password: formData.password }),
        firstName: formData.name,
        lastName: formData.surname,
        ...(formData.email
          ? {
              emailAddresses: [
                {
                  emailAddress: formData.email,
                  primary: true,
                },
              ],
            }
          : {}),
        publicMetadata: {
          role: 'teacher',
          birthday: formData.birthday.toISOString(),
          bloodType: formData.bloodType,
          sex: formData.sex,
        },
      })
      .catch((error: any) => {
        console.error('Clerk createUser error:', error);
        if (error.errors) {
          console.log('Clerk error details:', error.errors);
        }
        throw error;
      });

    await db.teacher
      .update({
        where: {
          id: formData.id,
        },
        data: {
          ...(formData.password !== '' && { password: formData.password }),
          teacherClerkId: user.id,
          username: formData.username,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          img: formData.img,
          bloodType: formData.bloodType,
          sex: formData.sex,
          birthday: formData.birthday,
          subjects: formData.subjects?.length
            ? {
                set: formData.subjects.map((subjectId: string) => ({
                  id: subjectId,
                })),
              }
            : undefined,
        },
      })
      .catch((error) => {
        console.error('Database creation error:', error);
        // If database creation fails, we should delete the Clerk user
        client.users
          .deleteUser(user.id)
          .catch((e: any) =>
            console.error(
              'Failed to delete Clerk user after database error:',
              e
            )
          );
        throw error;
      });

    // revalidatePath('/list/teacher');
    return {
      success: true,
      error: false,
      message: 'Teacher updated successfully',
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
      message: err.message || 'Failed to update teacher. Please try again.',
    };
  }
};

export const deleteTeacher = async (
  currentState: TeacherInitialState,
  data: FormData
) => {
  const id = data.get('id') as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);
    await db.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath('/list/teacher');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
