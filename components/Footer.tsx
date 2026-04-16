import { Video, Instagram, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 pt-16 pb-8 px-6 bg-[#07090F]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#952EBE] to-[#3A46DA] flex items-center justify-center">
                <Video size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                <span className="gradient-text">NEON</span>
                <span className="text-white/80">FRAMEWORKS</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
              Cinematic storytelling for brands, artists, and couples. Based in Ranchi, available worldwide.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/neonframeworks" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/50 hover:text-pink-400 hover:border-pink-500/30 transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://wa.me/918509554451" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/50 hover:text-green-400 hover:border-green-500/30 transition-all">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 tracking-wide text-sm uppercase">Quick Links</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li><Link href="/work" className="hover:text-[#952EBE] transition-colors">Portfolio</Link></li>
              <li><a href="/#services" className="hover:text-[#952EBE] transition-colors">Services</a></li>
              <li><a href="/#founder" className="hover:text-[#952EBE] transition-colors">About Us</a></li>
              <li><a href="/#contact" className="hover:text-[#952EBE] transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 tracking-wide text-sm uppercase">Contact</h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li><a href="mailto:Neonframeworks0@gmail.com" className="hover:text-white transition-colors block truncate">Neonframeworks0@gmail.com</a></li>
              <li><a href="tel:+918509554451" className="hover:text-white transition-colors">+91 85095 54451</a></li>
              <li><a href="https://maps.google.com/?q=Lalpur,+Ranchi,+Jharkhand" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Lalpur, Ranchi, Jharkhand</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs text-center md:text-left">
            © {year} Neonframeworks by Rahul Das (IICONIC). All rights reserved.
          </p>
          <p className="text-white/30 text-xs text-center md:text-right">
            Created with ❤️ by <a href="https://pixelbytes.online" target="_blank" rel="noopener noreferrer" className="text-[#952EBE] hover:text-white transition-colors font-medium">Pixelbytes</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
