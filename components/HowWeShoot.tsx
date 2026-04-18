'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const FRAME_COUNT = 240;

const currentFrame = (index: number) => {
  return `/assets/frame splits/ezgif-frame-${String(index).padStart(3, '0')}.png`;
};

export default function HowWeShoot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(1);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const renderRequested = useRef(false);

  useEffect(() => {
    let loadedImages = 0;
    const images: HTMLImageElement[] = [];
    imagesRef.current = images;

    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
            loadedImages++;
            setLoadingProgress(Math.round((loadedImages / FRAME_COUNT) * 100));
            if (loadedImages === FRAME_COUNT) {
                 setLoaded(true);
                 requestAnimationFrame(() => renderFrame(1));
            }
        };
        images.push(img);
    }
  }, []);

  const renderFrame = (index: number) => {
      const canvas = canvasRef.current;
      const img = imagesRef.current[index - 1];
      if (!canvas || !img || !img.complete) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (canvas.width !== img.width || canvas.height !== img.height) {
          canvas.width = img.width;
          canvas.height = img.height;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const scale = 1.15;
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const dx = (canvas.width - scaledWidth) / 2;
      const dy = (canvas.height - scaledHeight) / 2;
      
      ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);
  }

  useEffect(() => {
     const handleScroll = () => {
         if (!containerRef.current) return;
         
         const rect = containerRef.current.getBoundingClientRect();
         const stickyTop = window.innerHeight * 0.15;

         if (rect.top <= stickyTop && rect.bottom >= stickyTop) {
             const scrollDistance = stickyTop - rect.top;
             // Total maxScroll is bounds from start to end of text reaching the sticky top
             const maxScroll = Math.max(1, rect.height - window.innerHeight);
             let fraction = scrollDistance / maxScroll;
             fraction = Math.max(0, Math.min(1, fraction));
             
             const frameIndex = Math.floor(fraction * (FRAME_COUNT - 1)) + 1;
             
             if (!renderRequested.current && frameIndex !== currentFrameIndex) {
                 renderRequested.current = true;
                 requestAnimationFrame(() => {
                     renderFrame(frameIndex);
                     setCurrentFrameIndex(frameIndex);
                     renderRequested.current = false;
                 });
             }
         }
     };

     window.addEventListener('scroll', handleScroll, { passive: true });
     window.addEventListener('resize', handleScroll, { passive: true });
     
     handleScroll();
     
     return () => {
         window.removeEventListener('scroll', handleScroll);
         window.removeEventListener('resize', handleScroll);
     };
  }, [loaded, currentFrameIndex]);

  return (
    <section ref={containerRef} className="relative w-full bg-black z-20 py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        
        {/* Left Side: Sticky Video Player */}
        <div className="w-full lg:w-1/2 relative lg:static">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:sticky lg:top-[15vh] w-full aspect-video md:aspect-[4/3] lg:aspect-video rounded-3xl overflow-hidden drop-shadow-2xl bg-black">
             {!loaded && (
               <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-neutral-900 text-white pointer-events-none">
                  <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
                     <div className="h-full bg-white transition-all duration-300 ease-out" style={{ width: `${loadingProgress}%` }} />
                  </div>
                  <p className="mt-4 text-[10px] tracking-widest font-mono text-neutral-400">LOADING FILES {loadingProgress}%</p>
               </div>
            )}
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none mix-blend-overlay"></div>
          </motion.div>
        </div>

        {/* Right Side: Tall Scrolling Text */}
        <div className="w-full lg:w-1/2 flex flex-col justify-start lg:pt-[10vh] pb-[20vh]">
           <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
             <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#952EBE] mb-4 block">Behind The Scenes</span>
             <h2 className="text-4xl md:text-6xl font-black mb-20 text-white leading-tight">
               How We <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#952EBE] to-[#3A46DA]">Shoot</span>
             </h2>
           </motion.div>

           <div className="space-y-32 pl-4 border-l border-white/10">
             <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.6 }} className="relative">
               <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(149,46,190,0.5)]">
                 <div className="w-2 h-2 rounded-full bg-[#952EBE]"></div>
               </div>
               <h3 className="text-2xl font-bold text-white mb-6 ml-8">Phase 1: Conceptualization</h3>
               <p className="text-neutral-400 text-lg leading-relaxed ml-8 hover:text-neutral-200 transition-colors">
                 Before we ever press the record button, we undergo rigorous storyboarding and conceptualization. We believe that every frame must serve an underlying narrative. Our team of directors and cinematographers analyze the essence of the event or the brand to establish an immersive visual tone. 
               </p>
               <p className="text-neutral-400 text-lg leading-relaxed mt-6 ml-8 hover:text-neutral-200 transition-colors">
                 We select the exact lenses, lighting fixtures, and grip equipment to translate pure emotion into a digital format. Pre-production is where the magic is meticulously orchestrated.
               </p>
             </motion.div>

             <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
               <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(58,70,218,0.5)]">
                 <div className="w-2 h-2 rounded-full bg-[#3A46DA]"></div>
               </div>
               <h3 className="text-2xl font-bold text-white mb-6 ml-8">Phase 2: The Execution</h3>
               <p className="text-neutral-400 text-lg leading-relaxed ml-8 hover:text-neutral-200 transition-colors">
                 On set, speed and precision are paramount. We deploy multi-camera setups relying on industry-standard cinema cameras. Our lighting setups are designed to shape the subject dynamically, extracting the natural beauty and rugged textures.
               </p>
               <p className="text-neutral-400 text-lg leading-relaxed mt-6 ml-8 hover:text-neutral-200 transition-colors">
                 With specialized steady-cam operators and high-speed drone units, we capture flawless motion that puts the audience exactly at the center of the action.
               </p>
             </motion.div>

             <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
               <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                 <div className="w-2 h-2 rounded-full bg-white"></div>
               </div>
               <h3 className="text-2xl font-bold text-white mb-6 ml-8">Phase 3: Post-Production</h3>
               <p className="text-neutral-400 text-lg leading-relaxed ml-8 hover:text-neutral-200 transition-colors">
                 The raw footage goes into our darkrooms of post-production. Sound engineering, foley creation, and dynamic frequency modulation breathe life into the imagery. 
               </p>
               <p className="text-neutral-400 text-lg leading-relaxed mt-6 ml-8 hover:text-neutral-200 transition-colors">
                 Finally, we apply our signature deep color grade. We push the dynamic range to the absolute limit, balancing neon highlights against crushed cinematic blacks for a final output that refuses to be ignored.
               </p>
             </motion.div>
           </div>
        </div>

      </div>
    </section>
  );
}
