'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaPlay, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import type { Video } from '@/types';
import { formatDuration, formatViews } from '@/lib/utils';

interface VideoCardProps {
  video: Video;
  index?: number;
  showCategory?: boolean;
}

export default function VideoCard({ video, index = 0, showCategory = true }: VideoCardProps) {
  const category = typeof video.category === 'object' ? video.category : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/videos/${video.slug}`} className="collection-card group block">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={video.thumbnail || 'https://via.placeholder.com/640x360/6366f1/ffffff?text=AKKI+STUDY+X'}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
            <div className="flex h-12 w-12 scale-0 items-center justify-center rounded-full bg-white/90 text-violet-600 shadow-lg transition-transform group-hover:scale-100">
              <FaPlay className="ml-0.5" />
            </div>
          </div>
          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white">
            <FaClock className="text-[9px]" />
            {formatDuration(video.duration)}
          </span>
          {video.isFree && (
            <span className="absolute left-2 top-2 rounded-lg bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
              FREE
            </span>
          )}
        </div>
        <div className="p-4">
          {showCategory && category && (
            <span
              className="mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
              style={{ backgroundColor: category.color || '#6366f1' }}
            >
              {category.name}
            </span>
          )}
          <h3 className="line-clamp-2 text-sm font-bold text-slate-800 group-hover:text-violet-600">
            {video.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {formatViews(video.views)} views · {video.instructor}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
