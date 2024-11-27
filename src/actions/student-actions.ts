'use server';

import { db } from '@/lib/db';
import { StudentSchema } from '@/lib/form-validation-schemas';
import { clerkClient } from '@clerk/nextjs/server';

export type StudentInitialState = {
  success: boolean;
  error: boolean;
  message?: string;
};

export const createStudent = async (
  currentState: StudentInitialState,
  formData: StudentSchema
): Promise<StudentInitialState> => {
  try {
    const client = await clerkClient();
    // Debug log the incoming data
    console.log('Creating student with data:', {
      username: formData.username,
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
    });

    // Check if username exists in database first
    const existingStudent = await db.student.findFirst({
      where: {
        username: formData.username,
      },
    });

    if (existingStudent) {
      console.log('Student already exists in database:', existingStudent);
      return {
        success: false,
        error: true,
        message: 'Username already exists in database',
      };
    }

    const classItem = await db.class.findUnique({
      where: {
        id: formData.classId,
      },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true, message: 'students count error' };
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
          role: 'student',
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

    // Create student in database
    const student = await db.student
      .create({
        data: {
          studentClerkId: user.id,
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
          gradeId: formData.gradeId,
          classId: formData.classId,
          parentId: formData.parentId,
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

    return {
      success: true,
      error: false,
      message: 'Student created successfully',
    };
  } catch (err: any) {
    console.error('Error in createStudent:', err);

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
      message: err.message || 'Failed to create student. Please try again.',
    };
  }
};

export const updateStudent = async (
  currentState: StudentInitialState,
  formData: StudentSchema
) => {
  if (!formData.studentClerkId) {
    return { success: false, error: true };
  }
  try {
    const client = await clerkClient();
    const user = await client.users
      .updateUser(formData?.studentClerkId, {
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
          role: 'student',
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

    await db.student
      .update({
        where: {
          id: formData.id,
        },
        data: {
          ...(formData.password !== '' && { password: formData.password }),
          studentClerkId: user.id,
          username: formData.username,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          img: formData.img || '',
          bloodType: formData.bloodType,
          sex: formData.sex,
          birthday: formData.birthday,
          gradeId: formData.gradeId,
          classId: formData.classId,
          parentId: formData.parentId,
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

    // revalidatePath('/list/student');
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

export const deleteStudent = async (
  currentState: StudentInitialState,
  data: FormData
) => {
  const id = data.get('id') as string;
  const studentClerkId = data.get('studentClerkId') as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);
    await db.student.delete({
      where: {
        studentClerkId: id,
      },
    });

    // revalidatePath('/list/student');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
