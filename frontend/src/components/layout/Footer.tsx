'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPlay, FaTwitter, FaInstagram, FaYoutube, FaTelegram } from 'react-icons/fa';

export default function Footer() {
  const pathname = usePathname();
  const hiddenPaths = ['/login', '/signup', '/gateway', '/forgot-password'];
  if (hiddenPaths.some((p) => pathname.startsWith(p))) return null;

  return (
    <footer className="mt-16 border-t border-white/60 bg-white/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)' }}
              >
                <FaPlay className="ml-0.5" />
              </div>
              <div>
                <p className="font-extrabold text-slate-800">AKKI STUDY X</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-500">Premium Edition</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Free access to world-class educational content. Learn without limits.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-800">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/library" className="hover:text-violet-600">Video Library</Link></li>
              <li><Link href="/categories" className="hover:text-violet-600">Categories</Link></li>
              <li><Link href="/playlists" className="hover:text-violet-600">Playlists</Link></li>
              <li><Link href="/watch-later" className="hover:text-violet-600">Watch Later</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-800">Account</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/dashboard" className="hover:text-violet-600">Dashboard</Link></li>
              <li><Link href="/notes" className="hover:text-violet-600">Notes</Link></li>
              <li><Link href="/profile" className="hover:text-violet-600">Profile</Link></li>
              <li><Link href="/settings" className="hover:text-violet-600">Settings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-slate-800">Connect</h4>
            <div className="flex gap-3 text-slate-500">
              <FaYoutube className="cursor-pointer text-xl hover:text-red-500" />
              <FaTelegram className="cursor-pointer text-xl hover:text-blue-500" />
              <FaInstagram className="cursor-pointer text-xl hover:text-pink-500" />
              <FaTwitter className="cursor-pointer text-xl hover:text-sky-500" />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200/60 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} AKKI STUDY X. All rights reserved. 100% Free Learning Platform.
        </div>
      </div>
    </footer>
  );
}
