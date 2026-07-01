import type { Metadata } from 'next';
import Providers from '@/components/layout/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'AKKI STUDY X | Premium Edition — Free Learning Platform',
  description: 'Learn without limits. Free access to world-class educational videos, courses, and study materials.',
  keywords: ['education', 'learning', 'videos', 'courses', 'free', 'AKKI STUDY X'],
  openGraph: {
    title: 'AKKI STUDY X | Premium Edition',
    description: 'Free access to world-class educational content',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
