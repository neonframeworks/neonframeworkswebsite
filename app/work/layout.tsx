import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Work — Neonframeworks',
  description: 'Complete portfolio of Neonframeworks — cinematic videos, weddings, events, music videos and brand films by Rahul Das (IICONIC).',
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
