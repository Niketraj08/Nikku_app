'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaCalculator, FaAtom, FaFlask, FaDna, FaCode, FaBook, FaLandmark, FaChartLine,
} from 'react-icons/fa';
import api from '@/lib/api';
import type { Category } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaCalculator, FaAtom, FaFlask, FaDna, FaCode, FaBook, FaLandmark, FaChartLine,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <h1 className="mb-2 text-2xl font-extrabold text-slate-800 md:text-3xl">Categories</h1>
      <p className="mb-8 text-sm text-slate-500">Browse all learning categories</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || FaBook;
          return (
            <Link key={cat._id} href={`/categories/${cat.slug}`} className="collection-card p-6 text-center">
              <div
                className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: cat.color }}
              >
                <Icon className="text-2xl" />
              </div>
              <h3 className="font-bold text-slate-800">{cat.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{cat.videoCount} videos</p>
              {cat.description && <p className="mt-2 line-clamp-2 text-[11px] text-slate-400">{cat.description}</p>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
