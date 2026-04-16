'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence,PanInfo } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'), limit(10));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Testimonial[];
          setTestimonials(data);
        }
      } catch {
        // Fallback
      }
    };
    fetch();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleDragEnd = (e: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center min-h-[80vh]">
      <div className="blob w-[20rem] md:w-[30rem] h-[20rem] md:h-[30rem] bg-[#952EBE] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px]" />

      <div className="max-w-6xl mx-auto relative z-10 w-full grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        {/* Left Typography Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-center lg:text-left"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#952EBE] flex items-center justify-center lg:justify-start gap-2">
            <MessageSquareQuote size={14} /> True Stories
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 text-white leading-[1.1]">
            Loved By <br className="hidden md:block"/>
            <span className="gradient-text">Our Clients</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-md mx-auto lg:mx-0 text-base md:text-lg leading-relaxed">
            Don't just take our word for it. Explore the experiences of brands, couples, and artists who chose Neonframeworks to tell their visual stories.
          </p>

          {/* Desktop Navigation Controls */}
          {testimonials.length > 0 && (
            <div className="hidden lg:flex gap-4 mt-10">
              <button
                onClick={handlePrev}
                className="w-14 h-14 rounded-full glass border border-white/10 hover:border-[#952EBE]/50 flex items-center justify-center text-white/50 hover:text-white hover:bg-[#952EBE]/10 transition-all group"
              >
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                className="w-14 h-14 rounded-full glass border border-white/10 hover:border-[#3A46DA]/50 flex items-center justify-center text-white/50 hover:text-white hover:bg-[#3A46DA]/10 transition-all group"
              >
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Right Flashcards Deck */}
        <div className="relative w-full h-[400px] md:h-[450px] flex items-center justify-center pt-8 md:pt-0">
          {testimonials.length > 0 ? (
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] h-full flex justify-center perspective-[1000px]">
              <AnimatePresence>
                {testimonials.map((t, i) => {
                  const diff = (i - currentIndex + testimonials.length) % testimonials.length;
                  
                  // Only show the top 3 cards in the deck
                  if (diff > 2 && diff !== testimonials.length - 1) return null;

                  // Active card is at diff === 0
                  const isActive = diff === 0;
                  
                  // Mobile positioning overrides
                  const xOffset = diff * 15;
                  const yOffset = diff * 20;
                  const scaleOffset = 1 - (diff * 0.05);

                  return (
                    <motion.div
                      key={t.id}
                      drag={isActive ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.8}
                      onDragEnd={handleDragEnd}
                      initial={{ opacity: 0, scale: 0.8, y: 100 }}
                      animate={{ 
                        opacity: isActive ? 1 : 1 - (diff * 0.3),
                        scale: scaleOffset,
                        y: yOffset,
                        x: xOffset,
                        zIndex: 30 - diff,
                        rotateZ: diff * 2 // slight tilt for the cards in back
                      }}
                      exit={{ opacity: 0, x: -200, rotateZ: -10, transition: { duration: 0.3 } }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                      className={`absolute w-full h-[320px] sm:h-[350px] glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col justify-between ${isActive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
                      style={{ 
                        backdropFilter: `blur(${16 + (diff * 4)}px)`,
                        transformOrigin: 'top center'
                      }}
                    >
                      {/* Sub-blob strictly inside the active card for color */}
                      {isActive && <div className="absolute -inset-10 bg-gradient-to-br from-[#952EBE] to-[#3A46DA] rounded-full blur-[80px] opacity-20 pointer-events-none z-0" />}
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-1">
                            {[...Array(t.rating || 5)].map((_, j) => (
                              <Star key={j} size={14} className="text-[#952EBE] fill-[#952EBE]" />
                            ))}
                          </div>
                          <Quote size={28} className="text-white/10" />
                        </div>

                        <p className="text-white/90 text-[15px] sm:text-base font-medium leading-relaxed mb-6 line-clamp-4 flex-grow selection:bg-[#952EBE]/30">
                          &ldquo;{t.content}&rdquo;
                        </p>

                        <div className="flex items-center gap-3 sm:gap-4 mt-auto">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#952EBE] to-[#3A46DA] flex flex-shrink-0 items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg">
                            {t.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-white font-bold text-sm sm:text-base truncate">{t.name}</div>
                            <div className="text-[#952EBE]/90 text-xs sm:text-sm font-medium truncate">{t.role}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="w-full glass rounded-3xl p-10 flex flex-col items-center justify-center text-white/30 h-[300px]">
              <Quote size={36} className="mb-4 opacity-30" />
              <p>No testimonials available.</p>
            </div>
          )}
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex justify-center gap-4 mt-4 lg:hidden">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 active:bg-white/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 active:bg-white/10 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
