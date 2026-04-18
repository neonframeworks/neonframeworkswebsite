'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';

const TYPEWRITER_TEXTS = [
  'Cinematic Stories.',
  'Timeless Moments.',
  'Visual Poetry.',
  'Premium Production.',
];

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = TYPEWRITER_TEXTS[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 75);
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setTextIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, textIndex]);

  const scrollDown = () => {
    document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video background placeholder (uncomment to activate) */}
      <div className="absolute inset-0 z-0">
        {/*
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40"
          src="/bg.webm"
          aria-hidden="true"
        />
        */}
        {/* Fallback gradient when no video */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B101A] via-[#120820] to-[#0B1030]" />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Mesh blobs */}
      <div className="blob w-[600px] h-[600px] bg-[#952EBE] -top-40 -left-40 z-0" />
      <div className="blob w-[500px] h-[500px] bg-[#3A46DA] -bottom-20 -right-20 z-0" />
      <div className="blob w-[300px] h-[300px] bg-[#952EBE] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" style={{ opacity: 0.08 }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-4"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#952EBE] bg-[#952EBE]/10 border border-[#952EBE]/20 px-4 py-1.5 rounded-full">
            Visual Media Production
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-none"
        >
          <span className="text-white">We Capture</span>
          <br />
          <span className="gradient-text min-h-[1.2em] inline-block">
            {displayed}
            <span className="cursor text-[#952EBE]">|</span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Neonframeworks crafts award-winning visual narratives for weddings, brands, events & music.
          Every frame tells your story.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold bg-gradient-to-r from-[#952EBE] to-[#3A46DA] text-white hover:shadow-2xl hover:shadow-purple-500/30 transition-shadow text-base"
          >
            <Play size={16} fill="white" />
            View Our Work
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full font-bold glass border border-white/10 text-white hover:border-[#952EBE]/40 transition-colors text-base"
          >
            Book a Session
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 hover:text-white/60 transition-colors"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} />
      </motion.button>
    </section>
  );
}
