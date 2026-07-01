'use client';

import { useEffect, useState } from 'react';
import { FaPlay } from 'react-icons/fa';

export default function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f8fafc]">
      <div
        className="mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-[20px] text-white"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #d946ef)',
          animation: 'pulse-glow 2s infinite',
        }}
      >
        <FaPlay className="ml-1 text-2xl" />
      </div>
      <h2 className="text-[22px] font-extrabold tracking-wide text-slate-800">AKKI STUDY X</h2>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-[3px] text-violet-500">
        Premium Edition
      </p>
      <div className="mt-10 h-1 w-20 overflow-hidden rounded bg-slate-200">
        <div
          className="h-full w-1/2 rounded"
          style={{
            background: 'linear-gradient(90deg, #6366f1, #d946ef)',
            animation: 'loading-bar 1s infinite ease-in-out',
          }}
        />
      </div>
      <style jsx>{`
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(217, 70, 239, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(217, 70, 239, 0); }
          100% { box-shadow: 0 0 0 0 rgba(217, 70, 239, 0); }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
