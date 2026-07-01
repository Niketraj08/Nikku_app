'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import VideoCard from '@/components/video/VideoCard';
import api from '@/lib/api';
import type { Category, Video } from '@/types';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    api.get(`/categories/${slug}`).then((res) => {
      setCategory(res.data.data.category);
      setVideos(res.data.data.videos);
    });
  }, [slug]);

  if (!category) {
    return <div className="py-20 text-center text-slate-400">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-8 flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-extrabold text-white"
          style={{ backgroundColor: category.color }}
        >
          {category.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{category.name}</h1>
          <p className="text-sm text-slate-500">{videos.length} videos</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video, i) => (
          <VideoCard key={video._id} video={video} index={i} />
        ))}
      </div>
    </div>
  );
}
