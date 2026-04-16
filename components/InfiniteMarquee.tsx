'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';

interface Logo {
  id: string;
  mediaUrl: string;
}

export default function InfiniteMarquee() {
  const [logos, setLogos] = useState<Logo[]>([]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const q = query(collection(db, 'logos'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          mediaUrl: doc.data().mediaUrl,
        }));
        setLogos(data);
      } catch (err) {
        console.error('Failed to fetch logos', err);
      }
    };
    fetchLogos();
  }, []);

  if (logos.length === 0) return null;

  return (
    <div className="w-full py-20 overflow-hidden relative flex flex-col items-center">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0B101A] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0B101A] to-transparent z-10 pointer-events-none" />
      
      <div className="text-center mb-12 z-20 relative">
        <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#952EBE]">
          Collaborations
        </span>
        <h2 className="text-3xl md:text-4xl font-black mt-2 text-white">
          OUR BRAND <span className="gradient-text">PARTNERS</span>
        </h2>
      </div>

      <div className="flex gap-16 whitespace-nowrap animate-marquee items-center will-change-transform min-w-max px-8">
        {/* Render multiple sets to ensure infinite seamless scrolling */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-16 items-center shrink-0">
            {logos.map((logo) => (
              <div key={`${i}-${logo.id}`} className="relative h-12 w-32 shrink-0 transition-transform duration-300 hover:scale-105">
                <Image
                  src={logo.mediaUrl}
                  alt="Client Logo"
                  fill
                  sizes="128px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
