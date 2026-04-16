import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Neonframeworks — Cinematic Videography Agency',
  description:
    'Premium videography and cinematography studio founded by Rahul Das (IICONIC). We capture weddings, events, music videos, and brand stories with unmatched cinematic quality across India.',
  keywords: ['videography', 'cinematography', 'wedding films', 'music videos', 'brand films', 'Rahul Das', 'IICONIC', 'event videographer'],
  authors: [{ name: 'Rahul Das' }],
  robots: 'index, follow',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'Neonframeworks | Cinematic Videography Agency',
    description: 'Cinematic Videography Agency by Rahul Das (IICONIC). Premium storytelling for weddings, brands, and artists.',
    type: 'website',
    siteName: 'Neonframeworks',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neonframeworks',
    description: 'Premium videography and cinematography studio.',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="bg-[#0B101A] text-white font-montserrat antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
