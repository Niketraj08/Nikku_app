'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (adminOnly && user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, adminOnly, router]);

  if (!isAuthenticated) return null;
  if (adminOnly && user?.role !== 'admin') return null;

  return <>{children}</>;
}
