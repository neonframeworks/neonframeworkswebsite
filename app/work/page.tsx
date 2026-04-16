'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PortfolioItem, MediaCard, Lightbox } from '@/components/Portfolio';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, SlidersHorizontal, X, ArrowLeft, Film } from 'lucide-react';

const CATEGORIES = ['All', 'Event', 'Music', 'Brand', 'Short Film', 'Reels'];

export default function WorkPage() {
  const [all, setAll] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setAll(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PortfolioItem[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter((item) => {
      const matchCategory = category === 'All' || item.category === category;
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.artistName || '').toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [all, search, category]);

  // Group by artist/event name for display
  const grouped = useMemo(() => {
    const map = new Map<string, PortfolioItem[]>();
    filtered.forEach((item) => {
      const key = item.artistName?.trim() || 'Other Projects';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const clearSearch = () => setSearch('');

  return (
    <div className="min-h-screen bg-[#0B101A]">
      <Navbar />

      {/* Page hero */}
      <section className="pt-32 pb-10 px-6 relative overflow-hidden">
        <div className="blob w-80 h-80 bg-[#952EBE] -top-20 left-0 opacity-10" />
        <div className="blob w-72 h-72 bg-[#3A46DA] top-0 right-0 opacity-10" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors"
            >
              <ArrowLeft size={15} /> Back to Home
            </Link>

            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#952EBE] block mb-3">
              Complete Portfolio
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              All <span className="gradient-text">Work</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl">
              Every project, every story — searchable by artist, event name, or category.
            </p>
          </motion.div>

          {/* Search + Filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-3"
          >
            {/* Search input */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by artist name, event, or keyword..."
                maxLength={200}
                className="input-field w-full rounded-xl pl-11 pr-10 py-3.5 text-white placeholder-white/25 text-sm"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden glass px-4 py-3 rounded-xl flex items-center gap-2 text-white/70 text-sm border border-white/5"
            >
              <SlidersHorizontal size={15} />
              Filters
              {category !== 'All' && (
                <span className="w-2 h-2 rounded-full bg-[#952EBE]" />
              )}
            </button>
          </motion.div>

          {/* Category pills - desktop always visible, mobile togglable */}
          <AnimatePresence>
            {(showFilters || true) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      category === cat
                        ? 'bg-gradient-to-r from-[#952EBE] to-[#3A46DA] text-white shadow-lg shadow-purple-500/25'
                        : 'glass text-white/50 hover:text-white border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                {(category !== 'All' || search) && (
                  <button
                    onClick={() => { setCategory('All'); setSearch(''); }}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold text-red-400/70 hover:text-red-400 glass border border-white/5 flex items-center gap-1"
                  >
                    <X size={11} /> Clear
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result count */}
          {!loading && (
            <p className="text-white/30 text-xs mt-4">
              {filtered.length} project{filtered.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </p>
          )}
        </div>
      </section>

      {/* Portfolio content */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="aspect-video glass rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-white/30"
            >
              <Film size={44} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm mt-1">Try a different search term or category</p>
            </motion.div>
          ) : (
            // Grouped by artist / event name
            <div className="space-y-14">
              {grouped.map(([artistName, items], gi) => (
                <motion.div
                  key={artistName}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.05, duration: 0.5 }}
                >
                  {/* Group header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div>
                      <h2 className="text-xl font-bold text-white">{artistName}</h2>
                      <p className="text-white/30 text-xs mt-0.5">
                        {items.length} project{items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex-1 h-px bg-white/5" />
                    <div className="flex gap-1.5 flex-wrap justify-end">
                      {Array.from(new Set(items.map((i) => i.category))).map((cat) => (
                        <span
                          key={cat}
                          className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#952EBE]/10 text-[#952EBE] border border-[#952EBE]/15"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Grid for this artist */}
                  <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    <AnimatePresence>
                      {items.map((item) => (
                        <MediaCard key={item.id} item={item} onClick={setSelected} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <AnimatePresence>
        {selected && <Lightbox item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
