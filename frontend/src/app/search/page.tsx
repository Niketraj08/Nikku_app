'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/search/SearchBar';
import VideoCard from '@/components/video/VideoCard';
import api from '@/lib/api';
import type { Video, Category } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    Promise.all([
      api.get('/videos', { params: { search: q, limit: 20 } }),
      api.get('/categories'),
    ]).then(([vRes, cRes]) => {
      setVideos(vRes.data.data);
      setCategories(
        cRes.data.data.filter((c: Category) =>
          c.name.toLowerCase().includes(q.toLowerCase())
        )
      );
    }).finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-800">Search</h1>
      <div className="mb-8 max-w-xl">
        <SearchBar autoFocus />
      </div>

      {q && (
        <p className="mb-6 text-sm text-slate-500">
          Results for &ldquo;{q}&rdquo; {loading && '— searching...'}
        </p>
      )}

      {categories.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 font-bold text-slate-800">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat._id}
                href={`/categories/${cat.slug}`}
                className="rounded-full px-4 py-2 text-sm font-bold text-white"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video, i) => (
          <VideoCard key={video._id} video={video} index={i} />
        ))}
      </div>

      {q && !loading && videos.length === 0 && (
        <div className="collection-card py-16 text-center text-slate-400">No results found</div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
