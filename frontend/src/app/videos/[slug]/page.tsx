'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaBookmark, FaStickyNote } from 'react-icons/fa';
import VideoPlayer from '@/components/video/VideoPlayer';
import VideoCard from '@/components/video/VideoCard';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { Video } from '@/types';

function VideoDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [video, setVideo] = useState<Video | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get(`/videos/${slug}`).then((res) => setVideo(res.data.data)).catch(() => router.push('/library'));
  }, [slug, router]);

  const saveProgress = async (progress: number, duration: number) => {
    if (!isAuthenticated || !video) return;
    await api.post(`/videos/${video._id}/progress`, {
      progress,
      duration,
      completed: progress / duration > 0.9,
    });
  };

  const toggleWatchLater = async () => {
    if (!isAuthenticated || !video) return router.push('/login');
    if (saved) {
      await api.delete(`/watch-later/${video._id}`);
      setSaved(false);
    } else {
      await api.post('/watch-later', { videoId: video._id });
      setSaved(true);
    }
  };

  const handleEnded = () => {
    if (video?.relatedVideos?.[0]) {
      router.push(`/videos/${video.relatedVideos[0].slug}`);
    }
  };

  if (!video) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="aspect-video animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  const category = typeof video.category === 'object' ? video.category : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <VideoPlayer
        video={video}
        onProgress={saveProgress}
        onEnded={handleEnded}
        autoplay
      />

      <div className="mt-6">
        {category && (
          <span
            className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.name}
          </span>
        )}
        <h1 className="text-xl font-extrabold text-slate-800 md:text-2xl">{video.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{video.views} views · {video.instructor}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={toggleWatchLater} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-white">
            <FaBookmark className={saved ? 'text-violet-600' : ''} /> Watch Later
          </button>
          {isAuthenticated && (
            <button
              onClick={() => router.push(`/notes?video=${video._id}`)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-white"
            >
              <FaStickyNote /> Add Note
            </button>
          )}
        </div>

        <div className="collection-card mt-6 p-5">
          <h3 className="mb-2 font-bold text-slate-800">Description</h3>
          <p className="text-sm leading-relaxed text-slate-600">{video.description}</p>
          {video.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <span key={tag} className="rounded-lg bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {video.relatedVideos && video.relatedVideos.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-extrabold text-slate-800">Related Videos</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {video.relatedVideos.map((v, i) => (
              <VideoCard key={v._id} video={v} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function VideoDetailsPage() {
  return <VideoDetailsContent />;
}
