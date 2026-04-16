'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import Link from 'next/link';

export default function ContactPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already seen and closed it in this session
    const hasSeen = sessionStorage.getItem('neonframeworks_popup_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000); // Popup appears after 5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('neonframeworks_popup_seen', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-[#0B101A] border border-white/10 rounded-3xl p-8 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#952EBE] rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#3A46DA] rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center relative z-10">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#952EBE] mb-2 block">
                Let's Create Together
              </span>
              <h2 className="text-2xl font-black text-white mb-4">
                Have a Project in <span className="gradient-text">Mind?</span>
              </h2>
              <p className="text-white/60 text-sm mb-8 leading-relaxed">
                Whether it's a cinematic wedding film, a dynamic music video, or a compelling brand story — we bring your vision to life.
              </p>
              
              <div className="flex flex-col gap-3">
                <Link href="#contact" onClick={handleClose}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#952EBE] to-[#3A46DA] text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                  >
                    <Send size={16} />
                    Get a Quote
                  </motion.div>
                </Link>
                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
