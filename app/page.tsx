import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import InfiniteMarquee from '@/components/InfiniteMarquee';
import Stats from '@/components/Stats';
import Portfolio from '@/components/Portfolio';
import YoutubeVideos from '@/components/YoutubeVideos';
import Services from '@/components/Services';
import Founder from '@/components/Founder';
import Team from '@/components/Team';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ContactPopup from '@/components/ContactPopup';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <InfiniteMarquee />
      <Portfolio />
      <YoutubeVideos />
      <Services />
      <Founder />
      <Team />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <ContactPopup />
    </main>
  );
}
