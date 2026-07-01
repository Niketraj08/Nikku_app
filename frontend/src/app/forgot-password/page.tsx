'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
      setError('');
    } catch {
      setError('Something went wrong');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="collection-card w-full max-w-md p-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Forgot Password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your email to receive a reset link</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {message && <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600">{message}</div>}
          {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
            placeholder="you@example.com"
          />
          <button type="submit" className="btn-primary w-full">Send Reset Link</button>
        </form>
        <Link href="/login" className="mt-4 block text-center text-sm font-bold text-violet-600">Back to Login</Link>
      </div>
    </div>
  );
}
