'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Award, Instagram, Youtube } from 'lucide-react';

export default function Founder() {
  return (
    <section id="founder" className="py-24 px-6 relative overflow-hidden">
      <div className="blob w-[500px] h-[500px] bg-[#3A46DA] -right-40 top-1/2 -translate-y-1/2 opacity-10" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#952EBE]">The Visionary</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 text-white">
            Meet the <span className="gradient-text">Founder</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-[4/5] max-w-sm mx-auto group"
            >
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#952EBE]/40 to-[#3A46DA]/40 rounded-2xl blur-[30px] scale-110 group-hover:scale-125 transition-transform duration-700" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 w-full h-full bg-gradient-to-br from-[#952EBE]/20 to-[#3A46DA]/20 flex items-center justify-center shadow-2xl">
                {/* Replace with actual founder photo URL from Firebase */}
                <div className="text-white/20 text-center w-full h-full">
                  <Image src="/founder.webp" alt="Rahul Das (IICONIC)" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              </div>
              {/* Floating badge */}
              {/* <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -right-6 glass rounded-xl p-4 border border-[#952EBE]/20"
              >
                <Award size={18} className="text-[#952EBE] mb-1" />
                <div className="text-white font-bold text-sm">12 Awards</div>
                <div className="text-white/50 text-xs">International</div>
              </motion.div> */}
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-2">
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-[#952EBE]">Founder & Director</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-1">Rahul Das</h3>
            <div className="text-xl font-semibold gradient-text mb-6">IICONIC</div>

            <div className="space-y-4 text-white/60 leading-relaxed">
              <p>
                <b>Founder, Director & Lead Editor.</b> Rahul brings creative visions to life through polished, high-impact video content. Managing projects from initial direction through final post-production, he leads Neonframeworks with a passion for cinematic excellence.
              </p>
              {/* <p>
                A self-taught director and cinematographer, Rahul has worked with artists, brands, and couples
                across India, crafting visuals that don&apos;t just document — they resonate, provoke, and inspire.
              </p> */}
              <p>
                His expertise spans advanced colour grading, editorial direction, and on-ground shoot management, making every frame a statement. </p>
            </div>

            {/* <div className="mt-8 flex flex-wrap gap-4">
              <div className="glass rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-black gradient-text">500+</div>
                <div className="text-white/50 text-xs mt-1">Films Directed</div>
              </div>
              <div className="glass rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-black gradient-text">8+</div>
                <div className="text-white/50 text-xs mt-1">Years Experience</div>
              </div>
              <div className="glass rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-black gradient-text">12</div>
                <div className="text-white/50 text-xs mt-1">Awards Won</div>
              </div>
            </div> */}

            <div className="mt-8 flex gap-3">
              <a
                href="https://www.instagram.com/iiconic_0/"
                className="glass rounded-full p-3 hover:border-[#952EBE]/40 border border-white/5 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} className="text-white/70" />
              </a>
              <a
                href="https://www.youtube.com/@neonframeworks"
                className="glass rounded-full p-3 hover:border-[#952EBE]/40 border border-white/5 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} className="text-white/70" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
