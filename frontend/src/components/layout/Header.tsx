'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPlay, FaSearch, FaUserCircle } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import SearchBar from '@/components/search/SearchBar';

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  const hiddenPaths = ['/login', '/signup', '/gateway'];
  if (hiddenPaths.some((p) => pathname.startsWith(p))) return null;

  return (
    <header className="glass-header sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)' }}
          >
            <FaPlay className="ml-0.5 text-sm" />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-extrabold tracking-wide text-slate-800">AKKI STUDY X</span>
            <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-violet-500">
              Premium
            </span>
          </div>
        </Link>

        <div className="hidden flex-1 max-w-md md:block">
          <SearchBar compact />
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link href="/admin" className="hidden rounded-xl px-3 py-2 text-xs font-bold text-violet-600 hover:bg-violet-50 sm:block">
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="hidden rounded-xl px-3 py-2 text-xs font-bold text-slate-600 hover:bg-white/60 sm:block">
                Dashboard
              </Link>
              <Link href="/profile" className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/60">
                {user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <FaUserCircle className="text-2xl text-violet-500" />
                )}
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-xl px-3 py-2 text-xs font-bold text-slate-600 hover:bg-white/60">
                Login
              </Link>
              <Link href="/signup" className="btn-primary text-xs !py-2 !px-4">
                Sign Up
              </Link>
            </>
          )}
          <Link href="/search" className="rounded-xl p-2 text-slate-600 hover:bg-white/60 md:hidden">
            <FaSearch />
          </Link>
        </div>
      </div>
    </header>
  );
}
