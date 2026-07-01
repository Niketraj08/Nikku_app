'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingNav from '@/components/layout/FloatingNav';

export default function Providers({ children }: { children: React.ReactNode }) {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingNav />
    </>
  );
}
