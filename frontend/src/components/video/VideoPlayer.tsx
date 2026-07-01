'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FaPlay, FaPause, FaExpand, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import type { Video } from '@/types';
import { formatDuration } from '@/lib/utils';

interface VideoPlayerProps {
  video: Video;
  onProgress?: (progress: number, duration: number) => void;
  onEnded?: () => void;
  autoplay?: boolean;
  initialProgress?: number;
}

export default function VideoPlayer({
  video,
  onProgress,
  onEnded,
  autoplay = false,
  initialProgress = 0,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoplay);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration || 0);
  const [showControls, setShowControls] = useState(true);

  const isEmbed = video.videoType === 'youtube' || video.videoType === 'vimeo';

  useEffect(() => {
    if (videoRef.current && initialProgress > 0) {
      videoRef.current.currentTime = initialProgress;
    }
  }, [initialProgress]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
    setPlaying(!playing);
  }, [playing]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration || video.duration);
    onProgress?.(videoRef.current.currentTime, videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleFullscreen = () => {
    const el = videoRef.current?.parentElement;
    if (el?.requestFullscreen) el.requestFullscreen();
  };

  const changeSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const idx = speeds.indexOf(speed);
    const next = speeds[(idx + 1) % speeds.length];
    setSpeed(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  if (isEmbed) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl">
        <iframe
          src={`${video.videoUrl}?autoplay=${autoplay ? 1 : 0}`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title}
        />
      </div>
    );
  }

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(playing ? false : true)}
    >
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="h-full w-full"
        muted={muted}
        autoPlay={autoplay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => { setPlaying(false); onEnded?.(); }}
        onClick={togglePlay}
        playsInline
      />

      <div
        className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="px-4 pb-4">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="mb-2 w-full accent-violet-500"
          />
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="text-lg">
                {playing ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={() => setMuted(!muted)}>
                {muted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <span className="text-xs">
                {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={changeSpeed} className="rounded-lg bg-white/20 px-2 py-1 text-xs font-bold">
                {speed}x
              </button>
              <button onClick={toggleFullscreen}>
                <FaExpand />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
