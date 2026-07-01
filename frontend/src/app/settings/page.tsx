'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

function SettingsContent() {
  const user = useAuthStore((s) => s.user);
  const [autoplay, setAutoplay] = useState(user?.preferences?.autoplay ?? true);
  const [playbackSpeed, setPlaybackSpeed] = useState(user?.preferences?.playbackSpeed ?? 1);
  const [emailNotifications, setEmailNotifications] = useState(user?.preferences?.emailNotifications ?? true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const savePreferences = async () => {
    await api.put('/users/profile', {
      preferences: { autoplay, playbackSpeed, emailNotifications },
    });
    setMessage('Preferences saved');
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/users/password', { currentPassword, newPassword });
      setMessage('Password updated');
      setCurrentPassword('');
      setNewPassword('');
    } catch {
      setMessage('Failed to update password');
    }
  };

  const verifyEmail = async () => {
    await api.post('/auth/verify-email');
    setMessage('Email verified');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6">
      <h1 className="mb-8 text-2xl font-extrabold text-slate-800">Settings</h1>
      {message && <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600">{message}</div>}

      <div className="collection-card mb-6 space-y-4 p-6">
        <h2 className="font-bold text-slate-800">Playback</h2>
        <label className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Autoplay next video</span>
          <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} className="accent-violet-600" />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Default playback speed</span>
          <select value={playbackSpeed} onChange={(e) => setPlaybackSpeed(Number(e.target.value))} className="rounded-lg border px-2 py-1 text-sm">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
              <option key={s} value={s}>{s}x</option>
            ))}
          </select>
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Email notifications</span>
          <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} className="accent-violet-600" />
        </label>
        <button onClick={savePreferences} className="btn-primary text-sm">Save Preferences</button>
      </div>

      <form onSubmit={changePassword} className="collection-card mb-6 space-y-4 p-6">
        <h2 className="font-bold text-slate-800">Change Password</h2>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" className="w-full rounded-xl border px-4 py-2 text-sm outline-none" />
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="w-full rounded-xl border px-4 py-2 text-sm outline-none" />
        <button type="submit" className="btn-primary text-sm">Update Password</button>
      </form>

      {!user?.isVerified && (
        <div className="collection-card p-6">
          <h2 className="font-bold text-slate-800">Email Verification</h2>
          <p className="mt-2 text-sm text-slate-500">Verify your email address</p>
          <button onClick={verifyEmail} className="btn-primary mt-4 text-sm">Verify Email</button>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
