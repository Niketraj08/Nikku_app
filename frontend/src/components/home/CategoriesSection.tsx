'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaCalculator, FaAtom, FaFlask, FaDna, FaCode, FaBook, FaLandmark, FaChartLine,
} from 'react-icons/fa';
import type { Category } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  FaCalculator, FaAtom, FaFlask, FaDna, FaCode, FaBook, FaLandmark, FaChartLine,
};

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  if (!categories?.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 md:text-2xl">Learning Categories</h2>
          <p className="mt-1 text-sm text-slate-500">Explore subjects tailored for every learner</p>
        </div>
        <Link href="/categories" className="text-sm font-bold text-violet-600">View All →</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
        {categories.map((cat, i) => {
          const Icon = iconMap[cat.icon] || FaBook;
          return (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="collection-card flex flex-col items-center p-5 text-center"
              >
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon className="text-xl" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">{cat.name}</h3>
                <p className="mt-1 text-[11px] text-slate-500">{cat.videoCount} videos</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
