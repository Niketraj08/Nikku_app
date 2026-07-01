'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';

interface CTASectionProps {
  title: string;
  subtitle: string;
}

export default function CTASection({ title, subtitle }: CTASectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl p-8 text-center md:p-14"
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)' }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative">
          <h2 className="text-2xl font-extrabold text-white md:text-4xl">{title}</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80 md:text-base">{subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3 text-sm font-bold text-violet-600 shadow-lg transition hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 px-8 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <FaPlay className="text-xs" /> Browse Library
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
