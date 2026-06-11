import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Users, Star, Zap } from 'lucide-react';

const HeroSection = () => {
  const stats = [
    { label: 'Active Gyms', value: '500+', icon: <Users size={18} /> },
    { label: 'Leads Generated', value: '50K+', icon: <TrendingUp size={18} /> },
    { label: 'Client Rating', value: '4.9★', icon: <Star size={18} /> },
    { label: 'AI Tools', value: '15+', icon: <Zap size={18} /> },
  ];

  return (
    <section
      className="hero-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 80,
      }}
    >
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute', top: '15%', right: '-5%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-8%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}
          className="hero-grid"
        >
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 20,
                padding: '6px 14px',
                marginBottom: 24,
              }}
            >
              <Zap size={14} color="#ef4444" />
              <span style={{ color: '#ef4444', fontSize: 13, fontWeight: 600 }}>
                AI-Powered Gym Marketing Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: 'clamp(40px, 5vw, 68px)',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: 24,
                fontFamily: 'Outfit',
              }}
            >
              Dominate Your
              <span className="gradient-text" style={{ display: 'block' }}>Local Fitness</span>
              Market with AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: 17,
                color: '#9ca3af',
                lineHeight: 1.7,
                marginBottom: 36,
                maxWidth: 480,
              }}
            >
              Generate AI marketing content, track leads, run digital campaigns, and boost your gym's 
              local SEO — all from one powerful dashboard. Built for gym owners who want results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}
            >
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button className="btn-primary animate-pulse-red" style={{ fontSize: 15, padding: '14px 32px' }}>
                  Start Free Trial
                  <ArrowRight size={18} />
                </button>
              </Link>
              <a href="#services" style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ fontSize: 15, padding: '14px 28px' }}>
                  <Play size={16} />
                  See How It Works
                </button>
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}
            >
              {stats.map((stat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 36, height: 36,
                    background: 'rgba(239,68,68,0.12)',
                    borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ef4444',
                  }}>
                    {stat.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Dashboard Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="animate-float"
          >
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 24,
              padding: 28,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(239,68,68,0.08)',
            }}>
              {/* Dashboard header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <p style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>Welcome back 👋</p>
                  <h3 style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>FitZone Dashboard</h3>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  borderRadius: 8, padding: '6px 12px',
                  fontSize: 12, fontWeight: 600, color: 'white',
                }}>Live</div>
              </div>

              {/* Mini stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Total Leads', value: '1,247', change: '+18%', up: true },
                  { label: 'Revenue', value: '₹8.4L', change: '+24%', up: true },
                  { label: 'Members', value: '316', change: '+12%', up: true },
                  { label: 'Campaigns', value: '8 Live', change: 'Active', up: true },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    padding: '14px',
                  }}>
                    <p style={{ color: '#6b7280', fontSize: 11, marginBottom: 6 }}>{item.label}</p>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{item.value}</p>
                    <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 500 }}>{item.change}</span>
                  </div>
                ))}
              </div>

              {/* Mini bar chart visual */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ color: '#6b7280', fontSize: 12, marginBottom: 10 }}>Monthly Leads</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
                  {[35, 52, 45, 68, 75, 83, 91, 78, 95, 108, 115, 122].map((v, i) => (
                    <div key={i} style={{
                      flex: 1,
                      height: `${(v / 122) * 100}%`,
                      background: i === 11
                        ? 'linear-gradient(180deg, #ef4444, #b91c1c)'
                        : 'rgba(239,68,68,0.3)',
                      borderRadius: '3px 3px 0 0',
                      transition: 'all 0.3s ease',
                    }} />
                  ))}
                </div>
              </div>

              {/* AI Badge */}
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 10, padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Zap size={16} color="#ef4444" />
                <span style={{ color: '#9ca3af', fontSize: 13 }}>
                  AI generated <strong style={{ color: 'white' }}>12 captions</strong> this week
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div:last-child { display: none; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
