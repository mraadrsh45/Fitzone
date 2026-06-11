import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServiceCards from '../components/ServiceCards';
import PricingCards from '../components/PricingCards';
import TrainerCards from '../components/TrainerCards';
import Testimonials from '../components/Testimonials';
import Gallery from '../components/Gallery';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Zap, Target, TrendingUp, Shield } from 'lucide-react';

const aiFeatures = [
  { icon: <Zap size={22} />, title: 'AI Content Generation', desc: 'Generate Instagram captions, hashtags, ad copy, blog ideas and email campaigns in seconds.', color: '#ef4444' },
  { icon: <Target size={22} />, title: 'Lead Management', desc: 'Capture, track, and convert gym leads from a single real-time dashboard powered by Supabase.', color: '#22c55e' },
  { icon: <TrendingUp size={22} />, title: 'Analytics & Insights', desc: 'Beautiful charts showing revenue growth, lead conversion rates, and social engagement.', color: '#3b82f6' },
  { icon: <Shield size={22} />, title: 'Local SEO Tools', desc: 'Generate optimized meta tags, local keywords and SEO strategies specific to your city.', color: '#a855f7' },
];

const Home = () => {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <HeroSection />

      {/* AI Features highlight */}
      <section id="ai-tools" style={{ padding: '72px 0', background: 'rgba(239,68,68,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ color: '#ef4444', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>
              Platform Features
            </span>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, marginBottom: 14 }}>
              Everything Your Gym Needs to <span className="gradient-text">Grow</span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: 15, maxWidth: 520, margin: '0 auto' }}>
              Built on Supabase + OpenAI — real-time, secure, and AI-powered from day one.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {aiFeatures.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                style={{
                  background: `linear-gradient(135deg, ${f.color}10, ${f.color}04)`,
                  border: `1px solid ${f.color}20`,
                  borderRadius: 18, padding: 28,
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ width: 52, height: 52, background: `${f.color}15`, border: `1px solid ${f.color}25`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 18 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceCards />
      <Gallery />
      <PricingCards />
      <TrainerCards />
      <Testimonials />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Home;
