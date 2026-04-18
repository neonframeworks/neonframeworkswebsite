'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Video } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLenis } from 'lenis/react';

const SCROLL_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#founder' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const lenis = useLenis();
  const isHome = pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleScroll = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      if (isHome) {
        if (lenis) {
          lenis.scrollTo(href, { offset: -60 });
        } else {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        router.push(`/${href}`);
      }
    }, 150);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-2">
            <div className="w-8 h-8 relative flex items-center justify-center">
              <img src="/logo.png" alt="Neonframeworks Logo" className="object-contain w-full h-full" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="gradient-text">NEON</span>
              <span className="text-white/90">FRAMEWORKS</span>
            </span>
          </motion.div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/work"
            className={`text-sm font-medium transition-colors duration-200 relative group ${
              pathname === '/work' ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            Work
            <span className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-[#952EBE] to-[#3A46DA] transition-all duration-300 ${
              pathname === '/work' ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </Link>
          {SCROLL_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleScroll(link.href)}
              className="text-white/60 hover:text-white text-sm font-medium transition-colors duration-200 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-[#952EBE] to-[#3A46DA] group-hover:w-full transition-all duration-300" />
            </button>
          ))}
          <motion.button
            onClick={() => handleScroll('#contact')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#952EBE] to-[#3A46DA] text-white hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
          >
            Book Now
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white/80 hover:text-white"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <Link
                href="/work"
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white text-sm font-medium text-left transition-colors"
              >
                Work
              </Link>
              {SCROLL_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleScroll(link.href)}
                  className="text-white/70 hover:text-white text-sm font-medium text-left transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleScroll('#contact')}
                className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#952EBE] to-[#3A46DA] text-white w-fit"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
