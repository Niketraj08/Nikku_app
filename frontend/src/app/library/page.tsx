'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import VideoCard from '@/components/video/VideoCard';
import api from '@/lib/api';
import type { Video } from '@/types';

function LibraryContent() {
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const featured = searchParams.get('featured');
  const popular = searchParams.get('popular');
  const trending = searchParams.get('trending');
  const category = searchParams.get('category');

  const fetchVideos = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    try {
      const { data } = await api.get('/videos', {
        params: {
          page: pageNum,
          limit: 12,
          featured: featured || undefined,
          popular: popular || undefined,
          trending: trending || undefined,
          category: category || undefined,
        },
      });
      setVideos((prev) => (reset ? data.data : [...prev, ...data.data]));
      setHasMore(pageNum < data.pagination.pages);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [featured, popular, trending, category]);

  useEffect(() => {
    setPage(1);
    fetchVideos(1, true);
  }, [fetchVideos]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchVideos(next);
  };

  const title = featured ? 'Featured Courses' : popular ? 'Popular Videos' : trending ? 'Trending Content' : 'Video Library';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <h1 className="mb-2 text-2xl font-extrabold text-slate-800 md:text-3xl">{title}</h1>
      <p className="mb-8 text-sm text-slate-500">Unlimited free access to all videos</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video, i) => (
          <VideoCard key={video._id} video={video} index={i} />
        ))}
      </div>

      {loading && (
        <div className="grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="collection-card aspect-video animate-pulse bg-slate-200" />
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <div className="mt-8 text-center">
          <button onClick={loadMore} className="btn-primary">Load More</button>
        </div>
      )}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading...</div>}>
      <LibraryContent />
    </Suspense>
  );
}
