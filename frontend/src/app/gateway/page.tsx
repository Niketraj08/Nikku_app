'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GatewayPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Establishing secure connection...');
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStatus('Redirecting to servers...'), 2000);
    const t2 = setTimeout(() => router.replace('/'), 2500);
    const t3 = setTimeout(() => {
      setShowFallback(true);
      setStatus('Taking too long?');
    }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [router]);

  return (
    <div
      className="flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#0f172a',
        backgroundImage:
          'radial-gradient(circle at 15% 50%, rgba(79, 70, 229, 0.15), transparent 25%), radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.15), transparent 25%)',
      }}
    >
      <div
        className="w-[90%] max-w-[400px] rounded-3xl border border-white/5 p-10 text-center shadow-2xl"
        style={{ background: '#1e293b', animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[20px] text-4xl"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
            animation: 'pulse 2s infinite',
          }}
        >
          🚀
        </div>
        <h1 className="mb-2 text-2xl font-black tracking-wide text-slate-50">AKKI STUDY X</h1>
        <p className="mb-8 text-sm font-semibold text-slate-400">{status}</p>
        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              animation: 'fillProgress 2.5s ease-in-out forwards',
              width: '0%',
            }}
          />
        </div>
        {showFallback && (
          <Link
            href="/"
            className="inline-block rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-[13px] font-semibold text-slate-400 transition hover:bg-white/10 hover:text-slate-50"
          >
            Click here to enter manually
          </Link>
        )}
      </div>
      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        @keyframes fillProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
