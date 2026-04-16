'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { value: 50, suffix: '+', label: 'Events Covered' },
  { value: 5, suffix: ' yrs', label: 'Industry Experience' },
  { value: 120, suffix: '+', label: 'Videos Delivered' },
  { value: 25, suffix: '+', label: 'Brand Parnters' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <div className="glass rounded-2xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black gradient-text mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/50 text-sm font-medium tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
