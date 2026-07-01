'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import VideoCard from '@/components/video/VideoCard';
import api from '@/lib/api';
import type { Video } from '@/types';

function WatchLaterContent() {
  const [items, setItems] = useState<Array<{ _id: string; video: Video }>>([]);

  useEffect(() => {
    api.get('/watch-later').then((res) => setItems(res.data.data));
  }, []);

  const remove = async (videoId: string) => {
    await api.delete(`/watch-later/${videoId}`);
    setItems((prev) => prev.filter((i) => i.video._id !== videoId));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <h1 className="mb-2 text-2xl font-extrabold text-slate-800">Watch Later</h1>
      <p className="mb-8 text-sm text-slate-500">Videos saved for later</p>
      {items.length === 0 ? (
        <div className="collection-card py-16 text-center text-slate-400">No saved videos yet</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, i) => item.video && (
            <div key={item._id} className="relative">
              <VideoCard video={item.video} index={i} />
              <button
                onClick={() => remove(item.video._id)}
                className="absolute right-3 top-3 rounded-lg bg-red-500 px-2 py-1 text-[10px] font-bold text-white"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WatchLaterPage() {
  return (
    <ProtectedRoute>
      <WatchLaterContent />
    </ProtectedRoute>
  );
}
