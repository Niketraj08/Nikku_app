'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';

function AdminContent() {
  const [tab, setTab] = useState<'analytics' | 'videos' | 'categories' | 'users' | 'homepage'>('analytics');
  const [analytics, setAnalytics] = useState<Record<string, unknown> | null>(null);
  const [videos, setVideos] = useState<Array<Record<string, unknown>>>([]);
  const [categories, setCategories] = useState<Array<Record<string, unknown>>>([]);
  const [users, setUsers] = useState<Array<Record<string, unknown>>>([]);
  const [homepage, setHomepage] = useState<Record<string, unknown> | null>(null);

  const [videoForm, setVideoForm] = useState({
    title: '', description: '', thumbnail: '', duration: 0,
    videoType: 'youtube', videoUrl: '', category: '', isFeatured: false, isPopular: false, isTrending: false,
  });
  const [catForm, setCatForm] = useState({ name: '', description: '', icon: 'FaBook', color: '#6366f1' });

  useEffect(() => {
    if (tab === 'analytics') api.get('/admin/analytics').then((r) => setAnalytics(r.data.data));
    if (tab === 'videos') {
      api.get('/admin/videos').then((r) => setVideos(r.data.data));
      api.get('/admin/categories').then((r) => setCategories(r.data.data));
    }
    if (tab === 'categories') api.get('/admin/categories').then((r) => setCategories(r.data.data));
    if (tab === 'users') api.get('/admin/users').then((r) => setUsers(r.data.data));
    if (tab === 'homepage') api.get('/admin/homepage').then((r) => setHomepage(r.data.data));
  }, [tab]);

  const createVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/admin/videos', videoForm);
    setVideoForm({ title: '', description: '', thumbnail: '', duration: 0, videoType: 'youtube', videoUrl: '', category: '', isFeatured: false, isPopular: false, isTrending: false });
    api.get('/admin/videos').then((r) => setVideos(r.data.data));
  };

  const deleteVideo = async (id: string) => {
    await api.delete(`/admin/videos/${id}`);
    setVideos((prev) => prev.filter((v) => v._id !== id));
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/admin/categories', catForm);
    setCatForm({ name: '', description: '', icon: 'FaBook', color: '#6366f1' });
    api.get('/admin/categories').then((r) => setCategories(r.data.data));
  };

  const saveHomepage = async () => {
    if (homepage) await api.put('/admin/homepage', homepage);
  };

  const tabs = ['analytics', 'videos', 'categories', 'users', 'homepage'] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-800">Admin Dashboard</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-bold capitalize ${tab === t ? 'tab-active' : 'tab-inactive'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'analytics' && analytics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Users', value: analytics.totalUsers },
            { label: 'Total Videos', value: analytics.totalVideos },
            { label: 'Categories', value: analytics.totalCategories },
            { label: 'Total Views', value: analytics.totalViews },
          ].map((stat) => (
            <div key={stat.label} className="collection-card p-5 text-center">
              <p className="text-2xl font-extrabold text-violet-600">{String(stat.value)}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'videos' && (
        <div className="space-y-6">
          <form onSubmit={createVideo} className="collection-card grid gap-3 p-5 md:grid-cols-2">
            <input value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} placeholder="Title" required className="rounded-xl border px-3 py-2 text-sm" />
            <input value={videoForm.videoUrl} onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })} placeholder="Video URL" required className="rounded-xl border px-3 py-2 text-sm" />
            <input value={videoForm.thumbnail} onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })} placeholder="Thumbnail URL" className="rounded-xl border px-3 py-2 text-sm" />
            <select value={videoForm.category} onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })} required className="rounded-xl border px-3 py-2 text-sm">
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={String(c._id)} value={String(c._id)}>{String(c.name)}</option>
              ))}
            </select>
            <textarea value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} placeholder="Description" className="rounded-xl border px-3 py-2 text-sm md:col-span-2" rows={2} />
            <button type="submit" className="btn-primary text-sm md:col-span-2">Upload Video</button>
          </form>
          <div className="space-y-2">
            {videos.map((v) => (
              <div key={String(v._id)} className="collection-card flex items-center justify-between p-4">
                <span className="text-sm font-bold">{String(v.title)}</span>
                <button onClick={() => deleteVideo(String(v._id))} className="rounded-lg bg-red-50 px-3 py-1 text-xs font-bold text-red-600">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'categories' && (
        <div className="space-y-6">
          <form onSubmit={createCategory} className="collection-card grid gap-3 p-5 md:grid-cols-2">
            <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} placeholder="Name" required className="rounded-xl border px-3 py-2 text-sm" />
            <input value={catForm.color} onChange={(e) => setCatForm({ ...catForm, color: e.target.value })} placeholder="Color" className="rounded-xl border px-3 py-2 text-sm" />
            <button type="submit" className="btn-primary text-sm md:col-span-2">Create Category</button>
          </form>
          <div className="grid gap-3 md:grid-cols-2">
            {categories.map((c) => (
              <div key={String(c._id)} className="collection-card p-4">
                <span className="font-bold" style={{ color: String(c.color) }}>{String(c.name)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={String(u._id)} className="collection-card flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-bold">{String(u.name)}</p>
                <p className="text-xs text-slate-500">{String(u.email)}</p>
              </div>
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-600">{String(u.role)}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'homepage' && homepage && (
        <div className="collection-card space-y-4 p-6">
          <input value={String(homepage.heroTitle || '')} onChange={(e) => setHomepage({ ...homepage, heroTitle: e.target.value })} className="w-full rounded-xl border px-4 py-2 text-sm" placeholder="Hero Title" />
          <textarea value={String(homepage.heroSubtitle || '')} onChange={(e) => setHomepage({ ...homepage, heroSubtitle: e.target.value })} className="w-full rounded-xl border px-4 py-2 text-sm" rows={2} placeholder="Hero Subtitle" />
          <input value={String(homepage.heroCta || '')} onChange={(e) => setHomepage({ ...homepage, heroCta: e.target.value })} className="w-full rounded-xl border px-4 py-2 text-sm" placeholder="CTA Text" />
          <button onClick={saveHomepage} className="btn-primary text-sm">Save Homepage</button>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContent />
    </ProtectedRoute>
  );
}
