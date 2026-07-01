'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import api from '@/lib/api';
import { formatDuration } from '@/lib/utils';
import type { Note } from '@/types';

function NotesContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('video');
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(!!videoId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [timestamp, setTimestamp] = useState(0);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchNotes = () => {
    api.get('/notes', { params: videoId ? { videoId } : {} }).then((res) => setNotes(res.data.data));
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/notes/${editId}`, { title, content, timestamp });
    } else {
      await api.post('/notes', { title, content, timestamp, video: videoId || notes[0]?.video });
    }
    setTitle('');
    setContent('');
    setTimestamp(0);
    setShowForm(false);
    setEditId(null);
    fetchNotes();
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/notes/${id}`);
    fetchNotes();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">My Notes</h1>
          <p className="text-sm text-slate-500">Timestamp notes with rich text</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <FaPlus /> New Note
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="collection-card mb-6 space-y-3 p-5">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" className="w-full rounded-xl border px-4 py-2 text-sm outline-none" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required placeholder="Note content..." className="w-full rounded-xl border px-4 py-2 text-sm outline-none" rows={4} />
          <div>
            <label className="text-xs font-bold text-slate-500">Timestamp (seconds)</label>
            <input type="number" value={timestamp} onChange={(e) => setTimestamp(Number(e.target.value))} className="mt-1 w-full rounded-xl border px-4 py-2 text-sm outline-none" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-sm">{editId ? 'Update' : 'Save'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border px-4 py-2 text-sm font-bold">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {notes.map((note) => {
          const video = typeof note.video === 'object' ? note.video : null;
          return (
            <div key={note._id} className="collection-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">{note.title || 'Untitled Note'}</h3>
                  {video && <p className="text-xs text-violet-600">{video.title}</p>}
                  {note.timestamp > 0 && (
                    <span className="mt-1 inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                      @ {formatDuration(note.timestamp)}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditId(note._id); setTitle(note.title); setContent(note.content); setTimestamp(note.timestamp); setShowForm(true); }} className="rounded-lg p-2 text-violet-600 hover:bg-violet-50"><FaEdit /></button>
                  <button onClick={() => handleDelete(note._id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><FaTrash /></button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">{note.content}</p>
            </div>
          );
        })}
        {notes.length === 0 && (
          <div className="collection-card py-16 text-center text-slate-400">No notes yet</div>
        )}
      </div>
    </div>
  );
}

export default function NotesPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
        <NotesContent />
      </Suspense>
    </ProtectedRoute>
  );
}
