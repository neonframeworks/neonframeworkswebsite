'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Team() {
  return (
    <section id="team" className="py-24 px-6 relative bg-[#07090F]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#952EBE]">Behind the Lens</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 text-white">
            The <span className="gradient-text">Squad</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-2xl mx-auto">
            Our collective of cinematographers, editors, and sound designers who bring cinematic visions to life. Passionate. Creative. Unstoppable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden glass border border-white/10"
        >
          <Image 
            src="/team.webp" 
            alt="Neonframeworks Team" 
            fill 
            sizes="100vw"
            className="object-cover opacity-80 mix-blend-lighten"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B101A] via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
