export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  bio?: string;
  preferences?: {
    autoplay: boolean;
    playbackSpeed: number;
    emailNotifications: boolean;
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  image: string;
  videoCount: number;
  isFeatured: boolean;
}

export interface Video {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  duration: number;
  views: number;
  likes: number;
  category: Category | string;
  tags: string[];
  videoType: 'mp4' | 'youtube' | 'vimeo' | 'hls';
  videoUrl: string;
  isFree: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  isTrending: boolean;
  instructor: string;
  level: string;
  relatedVideos?: Video[];
}

export interface Playlist {
  _id: string;
  name: string;
  description: string;
  videos: Video[];
  isPublic: boolean;
  thumbnail: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  timestamp: number;
  video: Video | string;
  createdAt: string;
}

export interface WatchHistoryItem {
  _id: string;
  progress: number;
  duration: number;
  completed: boolean;
  video: Video;
  lastWatchedAt: string;
}

export interface HomepageData {
  homepage: {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    testimonials: Array<{
      name: string;
      role: string;
      content: string;
      avatar: string;
      rating: number;
    }>;
    ctaTitle: string;
    ctaSubtitle: string;
  };
  featured: Video[];
  popular: Video[];
  trending: Video[];
  categories: Category[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
