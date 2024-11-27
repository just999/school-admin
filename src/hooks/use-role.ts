'use client';

// Alternative React Hook approach (for client-side components)
import { useUser } from '@clerk/nextjs';

export const useRole = () => {
  const { user } = useUser();
  return user?.publicMetadata?.role as string | undefined;
};
