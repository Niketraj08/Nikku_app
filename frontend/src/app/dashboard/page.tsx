'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlayCircle, FaBookmark, FaStickyNote, FaHistory } from 'react-icons/fa';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import VideoCard from '@/components/video/VideoCard';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { WatchHistoryItem, Video } from '@/types';

function DashboardContent() {
  const user = useAuthStore((s) => s.user);
  const [continueWatching, setContinueWatching] = useState<WatchHistoryItem[]>([]);
  const [recent, setRecent] = useState<WatchHistoryItem[]>([]);
  const [stats, setStats] = useState({ totalWatched: 0, completed: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/videos/continue-watching'),
      api.get('/videos/recently-watched'),
      api.get('/users/stats'),
    ]).then(([cw, rw, st]) => {
      setContinueWatching(cw.data.data);
      setRecent(rw.data.data);
      setStats(st.data.data);
    }).catch(() => {});
  }, []);

  const quickLinks = [
    { href: '/library', icon: FaPlayCircle, label: 'Video Library', color: '#6366f1' },
    { href: '/watch-later', icon: FaBookmark, label: 'Watch Later', color: '#d946ef' },
    { href: '/notes', icon: FaStickyNote, label: 'My Notes', color: '#8b5cf6' },
    { href: '/playlists', icon: FaHistory, label: 'Playlists', color: '#10b981' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800 md:text-3xl">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="mt-1 text-sm text-slate-500">Continue your learning journey</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="collection-card flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ backgroundColor: link.color }}>
              <link.icon />
            </div>
            <span className="text-sm font-bold text-slate-700">{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="collection-card p-4 text-center">
          <p className="text-2xl font-extrabold text-violet-600">{stats.totalWatched}</p>
          <p className="text-xs text-slate-500">Videos Watched</p>
        </div>
        <div className="collection-card p-4 text-center">
          <p className="text-2xl font-extrabold text-emerald-600">{stats.completed}</p>
          <p className="text-xs text-slate-500">Completed</p>
        </div>
      </div>

      {continueWatching.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-extrabold text-slate-800">Continue Watching</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {continueWatching.map((item, i) => item.video && (
              <VideoCard key={item._id} video={item.video as Video} index={i} />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-extrabold text-slate-800">Recently Watched</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recent.slice(0, 4).map((item, i) => item.video && (
              <VideoCard key={item._id} video={item.video as Video} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
