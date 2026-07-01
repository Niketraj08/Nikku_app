'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaPlay, FaRocket } from 'react-icons/fa';
import SearchBar from '@/components/search/SearchBar';

interface HeroProps {
  title: string;
  subtitle: string;
  cta: string;
}

export default function HeroSection({ title, subtitle, cta }: HeroProps) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-xs font-bold text-violet-600">
            <FaRocket /> Premium Edition — 100% Free
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-800 md:text-5xl lg:text-6xl">
            <span className="gradient-text">{title}</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-slate-500 md:text-lg">{subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/library" className="btn-primary inline-flex items-center gap-2">
              <FaPlay className="text-sm" /> {cta}
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-white"
            >
              Create Free Account
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="collection-card p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)' }}
            >
              <FaPlay className="ml-1 text-xl" />
            </div>
            <div>
              <p className="font-extrabold text-slate-800">AKKI STUDY X</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-500">Premium Edition</p>
            </div>
          </div>
          <SearchBar />
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Videos', value: '500+' },
              { label: 'Categories', value: '20+' },
              { label: 'Students', value: '10K+' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-violet-50 p-3">
                <p className="text-lg font-extrabold text-violet-600">{stat.value}</p>
                <p className="text-[10px] font-semibold text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
