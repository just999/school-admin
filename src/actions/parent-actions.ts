'use server';

import { db } from '@/lib/db';
import { ParentSchema } from '@/schema/parent-schema';

import { clerkClient } from '@clerk/nextjs/server';

export type ParentInitialState = {
  success: boolean;
  error: boolean;
  message?: string;
};

export const createParent = async (
  currentState: ParentInitialState,
  formData: ParentSchema
): Promise<ParentInitialState> => {
  try {
    const client = await clerkClient();
    // Debug log the incoming data
    console.log('Creating parent with data:', {
      username: formData.username,
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
    });

    // Check if username exists in database first
    const existingParent = await db.parent.findFirst({
      where: {
        username: formData.username,
      },
    });

    if (existingParent) {
      console.log('Parent already exists in database:', existingParent);
      return {
        success: false,
        error: true,
        message: 'Username already exists in database',
      };
    }

    // const classItem = await db.class.findUnique({
    //   where: {
    //     id: formData.classId,
    //   },
    //   include: {
    //     _count: {
    //       select: {
    //         parents: true,
    //       },
    //     },
    //   },
    // });

    // if (classItem && classItem.capacity === classItem._count.parents) {
    //   return { success: false, error: true, message: 'parents count error' };
    // }
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
          role: 'parent',
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

    // Create parent in database
    const parent = await db.parent
      .create({
        data: {
          parentClerkId: user.id,
          username: formData.username,
          name: formData.name,
          surname: formData.surname,
          email: formData.email || '',
          phone: formData.phone || '',
          address: formData.address,
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
      message: 'Parent created successfully',
    };
  } catch (err: any) {
    console.error('Error in createParent:', err);

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
      message: err.message || 'Failed to create parent. Please try again.',
    };
  }
};

export const updateParent = async (
  currentState: ParentInitialState,
  formData: ParentSchema
) => {
  if (!formData.parentClerkId) {
    return { success: false, error: true };
  }
  try {
    const client = await clerkClient();
    const user = await client.users
      .updateUser(formData?.parentClerkId, {
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
          role: 'parent',
        },
      })
      .catch((error: any) => {
        console.error('Clerk createUser error:', error);
        if (error.errors) {
          console.log('Clerk error details:', error.errors);
        }
        throw error;
      });

    await db.parent
      .update({
        where: {
          id: formData.id,
        },
        data: {
          ...(formData.password !== '' && { password: formData.password }),
          parentClerkId: user.id,
          username: formData.username,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
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

    // revalidatePath('/list/parent');
    return {
      success: true,
      error: false,
      message: 'Parent updated successfully',
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
      message: err.message || 'Failed to update parent. Please try again.',
    };
  }
};

export const deleteParent = async (
  currentState: ParentInitialState,
  data: FormData
) => {
  const id = data.get('id') as string;
  const parentClerkId = data.get('parentClerkId') as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);
    await db.parent.delete({
      where: {
        parentClerkId: id,
      },
    });

    // revalidatePath('/list/parent');
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
