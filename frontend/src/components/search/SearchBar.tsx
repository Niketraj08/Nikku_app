'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import api from '@/lib/api';
import { debounce } from '@/lib/utils';
import type { Video, Category } from '@/types';

interface SearchBarProps {
  compact?: boolean;
  autoFocus?: boolean;
}

export default function SearchBar({ compact, autoFocus }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ videos: Video[]; categories: Category[] }>({
    videos: [],
    categories: [],
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = debounce(async (q: string) => {
    if (q.length < 2) {
      setSuggestions({ videos: [], categories: [] });
      return;
    }
    try {
      const { data } = await api.get('/videos/search/suggestions', { params: { q } });
      setSuggestions(data.data);
    } catch {
      setSuggestions({ videos: [], categories: [] });
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className={`flex items-center gap-2 rounded-2xl bg-white/80 ${compact ? 'px-3 py-2' : 'px-4 py-3'} border border-white/60 shadow-sm`}>
          <FaSearch className="text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search videos, courses, categories..."
            autoFocus={autoFocus}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>
      </form>

      {showSuggestions && (suggestions.videos.length > 0 || suggestions.categories.length > 0) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl glass-panel p-2 shadow-xl">
          {suggestions.categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => { router.push(`/categories/${cat.slug}`); setShowSuggestions(false); }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-violet-50"
            >
              <span className="rounded-lg px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: cat.color }}>
                {cat.name}
              </span>
            </button>
          ))}
          {suggestions.videos.map((v) => (
            <button
              key={v._id}
              onClick={() => { router.push(`/videos/${v.slug}`); setShowSuggestions(false); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm hover:bg-violet-50"
            >
              <span className="line-clamp-1 font-medium text-slate-700">{v.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
