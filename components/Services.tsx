'use client';

import { motion } from 'framer-motion';
import { Camera, Music, Heart, Building2, Film, Zap } from 'lucide-react';

import Image from 'next/image';

const SERVICES = [
  {
    icon: Heart,
    title: 'Celebrations',
    description: 'Films that capture the emotion, magic, and every fleeting moment of your most special day.',
    span: 'md:col-span-2',
    gradient: 'from-[#952EBE]/20 to-transparent',
    image: '/assets/service_celebrations.jpg',
  },
  {
    icon: Music,
    title: 'Music Videos',
    description: 'Visually stunning music videos that amplify your sound with compelling narrative and cinematic flair.',
    span: '',
    gradient: 'from-[#3A46DA]/20 to-transparent',
    image: '/assets/service_music_videos.jpg',
  },
  {
    icon: Building2,
    title: 'Brand Films',
    description: 'Strategic brand storytelling that connects with your audience and elevates your identity.',
    span: '',
    gradient: 'from-[#952EBE]/15 to-transparent',
    image: '/assets/service_brand_films.jpg',
  },
  {
    icon: Camera,
    title: 'Events & Concerts',
    description: 'Full-scale event documentation — corporate, cultural, social — with multi-camera setups.',
    span: '',
    gradient: 'from-[#3A46DA]/15 to-transparent',
    image: '/assets/service_events.jpg',
  },
  {
    icon: Film,
    title: 'Short Films',
    description: 'Narrative short films with professional-grade production, from concept to post.',
    span: 'md:col-span-2',
    gradient: 'from-[#952EBE]/20 to-[#3A46DA]/10',
    image: '/assets/service_short_films.jpg',
  },
  {
    icon: Zap,
    title: 'DJ Nights',
    description: 'High energy nights with neon lights and the crowd on fire.',
    span: '',
    gradient: 'from-[#3A46DA]/20 to-transparent',
    image: '/assets/service_dj_nights.jpg',
  },
  {
    icon: Zap,
    title: 'Video Editing',
    description: 'High energy nights with neon lights and the crowd on fire.',
    span: '',
    gradient: 'from-[#3A46DA]/20 to-transparent',
    image: '/assets/service_dj_nights.jpg',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 relative">
      <div className="blob w-80 h-80 bg-[#952EBE] bottom-20 left-0 opacity-10" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#952EBE]">What We Do</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 text-white">
            Our <span className="gradient-text">Services</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`bento-card rounded-2xl p-6 relative overflow-hidden group ${service.span}`}
              >
                <div className="absolute inset-0 opacity-40 z-0">
                  <Image src={service.image} alt={service.title} fill className="object-cover" sizes="400px" />
                  <div className="absolute inset-0 bg-black/60 object-cover" />
                </div>
                {/* Card gradient bg */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-50 z-0`} />

                <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#952EBE] to-[#3A46DA] flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{service.description}</p>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r from-[#952EBE] to-[#3A46DA] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
