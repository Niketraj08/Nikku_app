'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaUser, FaCog, FaSignOutAlt, FaBookmark, FaStickyNote, FaList, FaShieldAlt } from 'react-icons/fa';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

function ProfileContent() {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({ totalWatched: 0, completed: 0 });
  const [bio, setBio] = useState(user?.bio || '');
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/users/stats').then((res) => setStats(res.data.data));
  }, []);

  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setName(user.name || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleSave = async () => {
    await api.put('/users/profile', { name, bio, avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const menuItems = [
    { href: '/dashboard', icon: FaUser, label: 'Dashboard' },
    { href: '/watch-later', icon: FaBookmark, label: 'Watch Later' },
    { href: '/playlists', icon: FaList, label: 'Playlists' },
    { href: '/notes', icon: FaStickyNote, label: 'Notes' },
    { href: '/settings', icon: FaCog, label: 'Settings' },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <div className="collection-card p-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-2xl font-extrabold text-white">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            user?.name?.charAt(0)?.toUpperCase()
          )}
        </div>
        <h1 className="text-xl font-extrabold text-slate-800">{user?.name}</h1>
        <p className="text-sm text-slate-500">{user?.email}</p>
        {user?.role === 'admin' && (
          <Link href="/admin" className="mt-2 inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-600">
            <FaShieldAlt /> Admin
          </Link>
        )}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-violet-50 p-3">
            <p className="text-lg font-extrabold text-violet-600">{stats.totalWatched}</p>
            <p className="text-[10px] text-slate-500">Watched</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3">
            <p className="text-lg font-extrabold text-emerald-600">{stats.completed}</p>
            <p className="text-[10px] text-slate-500">Completed</p>
          </div>
        </div>
      </div>

      <div className="collection-card mt-6 space-y-4 p-6">
        <h2 className="font-bold text-slate-800">Edit Profile</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full rounded-xl border px-4 py-2 text-sm outline-none" />
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" className="w-full rounded-xl border px-4 py-2 text-sm outline-none" rows={3} />
        <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="Avatar URL" className="w-full rounded-xl border px-4 py-2 text-sm outline-none" />
        <button onClick={handleSave} className="btn-primary w-full text-sm">
          {saved ? 'Saved!' : 'Save Profile'}
        </button>
      </div>

      <div className="collection-card mt-6 divide-y divide-slate-100">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 px-5 py-4 text-sm font-semibold text-slate-700 hover:bg-violet-50">
            <item.icon className="text-violet-500" /> {item.label}
          </Link>
        ))}
        <button onClick={() => logout()} className="flex w-full items-center gap-3 px-5 py-4 text-sm font-semibold text-red-600 hover:bg-red-50">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
