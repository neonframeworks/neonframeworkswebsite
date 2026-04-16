'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Play, X, ArrowRight, Star } from 'lucide-react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface PortfolioItem {
  id: string;
  title: string;
  artistName: string;
  category: string;
  mediaUrl: string;
  type: 'image' | 'video';
  description?: string;
  createdAt: unknown;
}

export function MediaCard({
  item,
  onClick,
}: {
  item: PortfolioItem;
  onClick: (item: PortfolioItem) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer"
      onClick={() => onClick(item)}
    >
      {item.type === 'image' ? (
        <Image
          src={item.mediaUrl}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <video
          src={item.mediaUrl}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          muted
          preload="metadata"
          aria-label={item.title}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Play size={20} className="text-white ml-1" fill="white" />
            </div>
          </div>
        )}
        <span className="text-[10px] font-bold tracking-widest uppercase text-[#952EBE] mb-0.5">
          {item.category}
        </span>
        <h3 className="font-bold text-white text-sm leading-snug">{item.title}</h3>
        {item.artistName && (
          <p className="text-white/60 text-xs mt-0.5">{item.artistName}</p>
        )}
      </div>
    </motion.div>
  );
}

export function Lightbox({
  item,
  onClose,
}: {
  item: PortfolioItem;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/60 hover:text-white z-10"
          aria-label="Close"
        >
          <X size={28} />
        </button>
        {item.type === 'image' ? (
          <Image
            src={item.mediaUrl}
            alt={item.title}
            width={1200}
            height={675}
            className="w-full rounded-xl object-contain"
          />
        ) : (
          <video
            src={item.mediaUrl}
            controls
            autoPlay
            className="w-full rounded-xl"
            aria-label={item.title}
          />
        )}
        <div className="mt-4">
          <span className="text-xs font-bold tracking-widest uppercase text-[#952EBE]">
            {item.category}
          </span>
          <h3 className="text-xl font-bold text-white mt-1">{item.title}</h3>
          {item.artistName && (
            <p className="text-white/50 text-sm mt-1">{item.artistName}</p>
          )}
          {item.description && (
            <p className="text-white/40 text-sm mt-2 leading-relaxed">{item.description}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Home page featured section ───────────────────────────────────────────────
export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(
          collection(db, 'highlights'),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PortfolioItem[]);
      } catch {
        // collection may be empty or not yet created
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <section id="portfolio" className="py-24 px-6 relative">
      <div className="blob w-96 h-96 bg-[#3A46DA] top-0 right-0 opacity-10" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#952EBE]">
              Featured Work
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 text-white">
              Concert  <span className="gradient-text">Highlights</span>
            </h2>
            <p className="text-white/50 mt-3 max-w-xl">
              Handpicked stories told through light, motion, and emotion.
            </p>
          </div>
          <Link href="/work">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-[#952EBE]/30 text-white/80 hover:text-white text-sm font-semibold transition-colors group"
            >
              View All Work
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </motion.span>
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video glass rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <Star size={36} className="mx-auto mb-3 opacity-30" />
            <p>Ready for highlights. Go to the Admin Panel and upload to "Concert Highlights".</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {items.map((item) => (
                <MediaCard key={item.id} item={item} onClick={setSelected} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTA below grid */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link href="/work">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#952EBE] to-[#3A46DA] text-white font-bold text-sm hover:shadow-xl hover:shadow-purple-500/25 transition-shadow"
              >
                Explore Full Portfolio <ArrowRight size={16} />
              </motion.span>
            </Link>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && <Lightbox item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
