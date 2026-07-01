'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaPlayCircle, FaUser, FaSearch, FaBook } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: FaHome, label: 'Home' },
  { href: '/library', icon: FaPlayCircle, label: 'Library' },
  { href: '/categories', icon: FaBook, label: 'Categories' },
  { href: '/search', icon: FaSearch, label: 'Search' },
  { href: '/profile', icon: FaUser, label: 'Profile' },
];

export default function FloatingNav() {
  const pathname = usePathname();

  const hiddenPaths = ['/login', '/signup', '/gateway', '/admin'];
  if (hiddenPaths.some((p) => pathname.startsWith(p))) return null;

  return (
    <>
      <nav className="floating-nav glass-panel fixed bottom-5 left-1/2 z-50 hidden max-w-[400px] -translate-x-1/2 md:hidden">
        <div className="flex items-center justify-around gap-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-2 text-[10px] font-semibold transition-all',
                  active ? 'tab-active' : 'tab-inactive'
                )}
              >
                <Icon className="text-base" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
