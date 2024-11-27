'use server';

import { auth } from '@clerk/nextjs/server';

export const getUserRoleAndId = async () => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return { userId, role };
};
