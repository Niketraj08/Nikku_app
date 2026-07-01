'use client';

import { useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import type { Playlist } from '@/types';

function PlaylistsContent() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const fetchPlaylists = () => {
    api.get('/playlists').then((res) => setPlaylists(res.data.data));
  };

  useEffect(() => { fetchPlaylists(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/playlists/${editId}`, { name, description });
    } else {
      await api.post('/playlists', { name, description });
    }
    setName('');
    setDescription('');
    setShowForm(false);
    setEditId(null);
    fetchPlaylists();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this playlist?')) return;
    await api.delete(`/playlists/${id}`);
    fetchPlaylists();
  };

  const startEdit = (p: Playlist) => {
    setEditId(p._id);
    setName(p.name);
    setDescription(p.description);
    setShowForm(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Playlists</h1>
          <p className="text-sm text-slate-500">Organize your learning</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setName(''); setDescription(''); }} className="btn-primary flex items-center gap-2 text-sm">
          <FaPlus /> New Playlist
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="collection-card mb-6 space-y-3 p-5">
          <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Playlist name" className="w-full rounded-xl border px-4 py-2 text-sm outline-none" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full rounded-xl border px-4 py-2 text-sm outline-none" rows={2} />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-sm">{editId ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border px-4 py-2 text-sm font-bold">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {playlists.map((p) => (
          <div key={p._id} className="collection-card p-5">
            <h3 className="font-bold text-slate-800">{p.name}</h3>
            <p className="mt-1 text-xs text-slate-500">{p.videos?.length || 0} videos</p>
            {p.description && <p className="mt-2 text-sm text-slate-600">{p.description}</p>}
            <div className="mt-4 flex gap-2">
              <button onClick={() => startEdit(p)} className="flex items-center gap-1 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600">
                <FaEdit /> Edit
              </button>
              <button onClick={() => handleDelete(p._id)} className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlaylistsPage() {
  return (
    <ProtectedRoute>
      <PlaylistsContent />
    </ProtectedRoute>
  );
}
