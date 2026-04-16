'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface YoutubeItem {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'short';
  createdAt: any;
}

function getYoutubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function YoutubeVideos() {
  const [items, setItems] = useState<YoutubeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const q = query(collection(db, 'youtube_videos'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as YoutubeItem[]);
      } catch (err) {
        console.error('Error fetching youtube videos', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (!loading && items.length === 0) {
    return null; // hide section if there's nothing
  }

  const videos = items.filter((i) => i.type === 'video');
  const shorts = items.filter((i) => i.type === 'short');

  return (
    <section id="youtube-highlights" className="py-24 px-6 relative">
      <div className="blob w-96 h-96 bg-[#952EBE] bottom-0 right-0 opacity-10" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#952EBE]">
            Cinematic Highlights
          </span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 text-white">
            Watch Our <span className="gradient-text">Productions</span>
          </h2>
          <p className="text-white/50 mt-3 max-w-xl">
            Immerse yourself in our latest video projects and bite-sized shorts straight from our YouTube channel.
          </p>
        </motion.div>

        {loading ? (
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-white/5 rounded-2xl w-full"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Horizontal Videos */}
            {videos.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Play size={24} className="text-[#952EBE] fill-[#952EBE]" /> Latest Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {videos.map((video) => {
                    const ytId = getYoutubeId(video.url);
                    if (!ytId) return null;
                    return (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group relative aspect-video rounded-2xl overflow-hidden glass border border-white/5 hover:border-[#952EBE]/30 transition-all duration-300"
                      >
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            <h4 className="font-bold text-white text-sm">{video.title}</h4>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Vertical Shorts */}
            {shorts.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Play size={24} className="text-[#3A46DA] fill-[#3A46DA]" /> Shorts
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {shorts.map((short) => {
                    const ytId = getYoutubeId(short.url);
                    if (!ytId) return null;
                    return (
                      <motion.div
                        key={short.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="group relative aspect-[9/16] rounded-2xl overflow-hidden glass border border-white/5 hover:border-[#3A46DA]/30 transition-all duration-300"
                      >
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                          title={short.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full object-cover"
                        ></iframe>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
