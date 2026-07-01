'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaPlay } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="collection-card w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)' }}
          >
            <FaPlay className="ml-1" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800">Welcome Back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to AKKI STUDY X</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>
          )}
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-violet-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none focus:border-violet-400"
              placeholder="••••••••"
            />
          </div>
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs font-bold text-violet-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-60">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-bold text-violet-600 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
