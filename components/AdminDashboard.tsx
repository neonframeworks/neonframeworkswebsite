'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  query,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Trash2, Edit3, Film, Mail, Check, X, RefreshCw, Star, MessageSquareQuote, Video } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  artistName?: string;
  category: string;
  mediaUrl: string;
  type: 'image' | 'video';
  description?: string;
  featured?: boolean;
  createdAt: { seconds: number } | null;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: { seconds: number } | null;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  createdAt?: { seconds: number } | null;
}

interface YoutubeItem {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'short';
  createdAt: { seconds: number } | null;
}

const CATEGORIES = ['Concert', 'Club Events', 'Wedding', 'Event', 'Music', 'Brand', 'Short Film', 'Reels'];

function PortfolioTab({ collectionName, isLogos = false }: { collectionName: string, isLogos?: boolean }) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '', artistName: '', category: '', description: '' });
  const [deleting, setDeleting] = useState<string | null>(null);
  const [togglingFeatured, setTogglingFeatured] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PortfolioItem[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [collectionName]);

  const startEdit = (item: PortfolioItem) => {
    setEditId(item.id);
    setEditData({
      title: item.title,
      artistName: item.artistName || '',
      category: item.category,
      description: item.description || '',
    });
  };

  const saveEdit = async () => {
    if (!editId) return;
    const clean = {
      title: editData.title.replace(/[<>'\"&]/g, '').trim().slice(0, 200),
      artistName: editData.artistName.replace(/[<>'\"&]/g, '').trim().slice(0, 200),
      category: editData.category,
      description: editData.description.replace(/[<>'\"&]/g, '').trim().slice(0, 1000),
    };
    await fetch(`/api/${collectionName}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editId, ...clean }),
    });
    setEditId(null);
    fetchItems();
  };

  const deleteItem = async (item: PortfolioItem) => {
    if (!confirm(`Delete "${item.title || 'Brand Partner'}"? This cannot be undone.`)) return;
    setDeleting(item.id);
    try {
      if (item.mediaUrl?.includes('firebasestorage.googleapis.com')) {
        try {
          const storageRef = ref(storage, item.mediaUrl);
          await deleteObject(storageRef);
        } catch {}
      }
      await fetch(`/api/${collectionName}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="aspect-video glass rounded-xl animate-pulse" />
      ))}
    </div>
  );

  if (!items.length) return (
    <div className="text-center py-16 text-white/30">
      <Film size={40} className="mx-auto mb-3 opacity-30" />
      <p>No items found for {collectionName} collection yet. Upload some media!</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-white/50 text-sm">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        <button onClick={fetchItems} className="text-white/40 hover:text-white transition-colors">
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-xl overflow-hidden border border-white/5"
            >
              <div className="aspect-video relative bg-white/5 flex items-center justify-center p-4">
                {item.type === 'image' || isLogos ? (
                  <Image src={item.mediaUrl} alt={item.title || 'Logo'} fill className="object-contain" sizes="400px" />
                ) : (
                  <Film size={32} className="text-white/20" />
                )}
              </div>

              <div className="p-4">
                {editId === item.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      placeholder="Title"
                      className="input-field w-full rounded-lg px-3 py-2 text-white text-xs"
                    />
                    {!isLogos && (
                      <>
                        <input
                          type="text"
                          value={editData.artistName}
                          onChange={(e) => setEditData({ ...editData, artistName: e.target.value })}
                          placeholder="Artist / Event name"
                          className="input-field w-full rounded-lg px-3 py-2 text-white text-xs"
                        />
                        <select
                          value={editData.category}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          className="input-field w-full rounded-lg px-3 py-2 text-white text-xs bg-[#0B101A]"
                        >
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button onClick={saveEdit} className="flex-1 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs">Save</button>
                      <button onClick={() => setEditId(null)} className="flex-1 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{item.title}</p>
                        {item.artistName && <p className="text-white/40 text-xs truncate mt-0.5">{item.artistName}</p>}
                        {item.category && <p className="text-[#952EBE] text-xs mt-0.5">{item.category}</p>}
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => startEdit(item)} className="p-1.5 glass rounded-lg text-white/50 hover:text-white"><Edit3 size={13} /></button>
                        <button onClick={() => deleteItem(item)} disabled={deleting === item.id} className="p-1.5 glass rounded-lg text-red-400/60 hover:text-red-400">
                          {deleting === item.id ? <div className="w-3 h-3 animate-spin border-t-red-400 rounded-full"/> : <Trash2 size={13} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TestimonialsTab() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', role: '', content: '', rating: 5 });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Testimonial[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.content) return;
    setSaving(true);
    try {
      const sanitized = {
        name: form.name.replace(/[<>'\"&]/g, '').trim(),
        role: form.role.replace(/[<>'\"&]/g, '').trim(),
        content: form.content.replace(/[<>'\"&]/g, '').trim(),
        rating: form.rating,
      };

      if (editId) {
        await fetch('/api/testimonials/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editId, ...sanitized }),
        });
        setEditId(null);
      } else {
        await fetch('/api/testimonials/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sanitized),
        });
      }
      setForm({ name: '', role: '', content: '', rating: 5 });
      fetchItems();
    } catch {} finally {
      setSaving(false);
    }
  };

  const startEdit = (t: Testimonial) => {
    setEditId(t.id);
    setForm({ name: t.name, role: t.role, content: t.content, rating: t.rating || 5 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ name: '', role: '', content: '', rating: 5 });
  };

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete testimonial?')) return;
    await fetch('/api/testimonials/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-2xl mb-8">
        <h3 className="text-white font-bold mb-4">{editId ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
        <form onSubmit={handleAddOrEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field rounded-xl px-4 py-3 text-white text-sm" required />
            <input type="text" placeholder="Role (e.g. Wedding Client)" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input-field rounded-xl px-4 py-3 text-white text-sm" required />
          </div>
          <div className="flex items-center gap-4">
            <label className="text-white/50 text-sm">Rating (1-5):</label>
            <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} className="input-field rounded-xl px-4 py-2 text-white text-sm w-20" required />
          </div>
          <textarea placeholder="Review content..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="input-field rounded-xl px-4 py-3 text-white text-sm w-full" rows={3} required />
          
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-gradient-to-r from-[#952EBE] to-[#3A46DA] text-white font-bold py-2 px-6 rounded-xl text-sm disabled:opacity-50">
              {saving ? 'Saving...' : (editId ? 'Update Testimonial' : 'Add Testimonial')}
            </button>
            {editId && (
              <button type="button" onClick={cancelEdit} className="bg-white/5 text-white/70 hover:text-white font-bold py-2 px-6 rounded-xl text-sm">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {loading ? <p className="text-white/50">Loading...</p> : items.map((t) => (
          <div key={t.id} className="glass p-4 rounded-xl flex flex-col relative group">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(t)} className="text-white/50 hover:text-white"><Edit3 size={16}/></button>
              <button onClick={(e) => deleteItem(t.id, e)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
            </div>
            <div className="flex text-[#952EBE] mb-2">{[...Array(t.rating||5)].map((_,j)=><Star key={j} size={14} fill="currentColor"/>)}</div>
            <p className="text-white/70 text-sm mb-4">"{t.content}"</p>
            <div className="mt-auto pr-16">
              <div className="text-white font-bold text-sm truncate">{t.name}</div>
              <div className="text-white/40 text-xs truncate">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactsTab() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/contacts');
        const data = await res.json();
        if (data.contacts) {
          setContacts(data.contacts);
        }
      } catch (err) {
        console.error('Failed to fetch contacts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this contact lead?')) return;
    try {
      await fetch('/api/contacts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Failed to delete contact', err);
    }
  };

  if (loading) return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 glass rounded-xl animate-pulse" />
      ))}
    </div>
  );

  if (!contacts.length) return (
    <div className="text-center py-16 text-white/30">
      <Mail size={40} className="mx-auto mb-3 opacity-30" />
      <p>No contact leads yet.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      <p className="text-white/50 text-sm">{contacts.length} lead{contacts.length !== 1 ? 's' : ''}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Name', 'Email', 'Phone', 'Message', 'Date', ''].map((h, i) => (
                <th key={i} className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider pb-3 pr-6">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {contacts.map((c) => (
              <tr key={c.id} className="hover:bg-white/2 transition-colors group">
                <td className="py-3 pr-6 text-white font-medium text-sm whitespace-nowrap">{c.name}</td>
                <td className="py-3 pr-6">
                  <a href={`mailto:${c.email}`} className="text-[#952EBE] hover:underline text-sm">
                    {c.email}
                  </a>
                </td>
                <td className="py-3 pr-6">
                  <a href={`tel:${c.phone}`} className="text-[#952EBE] hover:underline text-sm">
                    {c.phone}
                  </a>
                </td>
                <td className="py-3 pr-6 text-white/50 text-sm max-w-xs">
                  <span className="line-clamp-2">{c.message}</span>
                </td>
                <td className="py-3 text-white/30 text-xs whitespace-nowrap">
                  {c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleDateString() : '—'}
                </td>
                <td className="py-3 text-right">
                  <button onClick={(e) => deleteItem(c.id, e)} className="p-1.5 glass rounded-lg text-red-400/60 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function YoutubeTab() {
  const [items, setItems] = useState<YoutubeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', url: '', type: 'video' });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'youtube_videos'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as YoutubeItem[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url) return;
    setSaving(true);
    try {
      await fetch('/api/youtube_videos/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ title: '', url: '', type: 'video' });
      fetchItems();
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this video?')) return;
    await fetch('/api/youtube_videos/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-2xl mb-8">
        <h3 className="text-white font-bold mb-4">Add YouTube Link</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="flex gap-4">
            <input type="text" placeholder="Video Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="flex-1 input-field rounded-xl px-4 py-3 text-white text-sm" required />
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value as 'video'|'short'})} className="input-field rounded-xl px-4 py-3 text-white text-sm w-32 bg-[#0B101A]">
              <option value="video">Video</option>
              <option value="short">Short</option>
            </select>
          </div>
          <input type="url" placeholder="YouTube URL (e.g. https://youtube.com/watch?v=...)" value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="input-field rounded-xl px-4 py-3 text-white text-sm w-full" required />
          <button type="submit" disabled={saving} className="bg-gradient-to-r from-[#952EBE] to-[#3A46DA] text-white font-bold py-2 px-6 rounded-xl text-sm disabled:opacity-50">
            {saving ? 'Adding...' : 'Add Video'}
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-white/50">Loading...</p> : items.map((t) => (
          <div key={t.id} className="glass p-4 rounded-xl flex flex-col relative group">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => deleteItem(t.id, e)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
            </div>
            <div className="flex items-center gap-2 mb-2">
               <Video size={16} className={t.type === 'short' ? 'text-[#3A46DA]' : 'text-[#952EBE]'} />
               <span className="text-xs font-bold text-white/50 uppercase">{t.type}</span>
            </div>
            <h4 className="text-white font-bold text-sm mb-2">{t.title}</h4>
            <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-[#952EBE] text-xs hover:underline truncate">{t.url}</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard({ activeTab }: { activeTab: 'portfolio' | 'logos' | 'highlights' | 'youtube' | 'testimonials' | 'contacts' }) {
  return (
    <div>
      {activeTab === 'portfolio' && <PortfolioTab collectionName="portfolio" />}
      {activeTab === 'highlights' && <PortfolioTab collectionName="highlights" />}
      {activeTab === 'youtube' && <YoutubeTab />}
      {activeTab === 'logos' && <PortfolioTab collectionName="logos" isLogos={true} />}
      {activeTab === 'testimonials' && <TestimonialsTab />}
      {activeTab === 'contacts' && <ContactsTab />}
    </div>
  );
}
