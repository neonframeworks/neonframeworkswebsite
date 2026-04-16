'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  // {
  //   q: 'How far in advance should we book?',
  //   a: 'We recommend booking at least 3–6 months in advance for weddings, and 4–6 weeks for events and brand projects. Popular dates fill fast — contact us early to secure your date.',
  // },
  {
    q: 'What areas do you cover?',
    a: 'Based in India, we shoot pan-India and are available for international projects. Travel costs are factored into the quote for outstation shoots.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Wedding films: 4–8 weeks. Event coverage: 1–2 weeks. Brand films and music videos: 2–4 weeks depending on edit complexity.',
  },
  {
    q: 'What equipment do you use?',
    a: 'We use Sony FX3/FX30 cinema cameras, DJI drones, gimbal stabilizers, professional lighting rigs, and industry-standard post-production tools (Premiere Pro after effects, DaVinci Resolve).',
  },
  {
    q: 'Do you Provide VFX?',
    a: 'Yes, we have bollywood level VFX Artists',
  },
  {
    q: 'Do you offer raw footage?',
    a: 'Yes, Raw footage is included in standard packages. We handle all post-production to ensure quality control and brand consistency.',
  },
  {
    q: 'What is your payment structure?',
    a: '50% advance to confirm the booking, and the remaining 50% before final delivery. We accept all major UPI, bank transfer, and digital payment methods.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6 relative">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#952EBE]">Got Questions?</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 text-white">
            Frequently <span className="gradient-text">Asked</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-xl overflow-hidden border border-white/5 hover:border-[#952EBE]/20 transition-colors duration-300"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
                aria-expanded={open === i}
              >
                <span className="text-white font-semibold text-sm md:text-base">{faq.q}</span>
                <span className="shrink-0 text-[#952EBE]">
                  {open === i ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-white/55 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
