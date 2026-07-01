'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import VideoCard from '@/components/video/VideoCard';
import type { Video } from '@/types';

interface VideoSectionProps {
  title: string;
  subtitle?: string;
  videos: Video[];
  viewAllHref?: string;
}

export default function VideoSection({ title, subtitle, videos, viewAllHref }: VideoSectionProps) {
  if (!videos?.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl font-extrabold text-slate-800 md:text-2xl"
          >
            {title}
          </motion.h2>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm font-bold text-violet-600 hover:text-violet-700">
            View All →
          </Link>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video, i) => (
          <VideoCard key={video._id} video={video} index={i} />
        ))}
      </div>
    </section>
  );
}
