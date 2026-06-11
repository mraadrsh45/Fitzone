import { motion } from 'framer-motion';
import { Dumbbell, Heart, Music, Leaf, User, Apple, ChevronRight } from 'lucide-react';

const services = [
  {
    icon: <Dumbbell size={28} />,
    title: 'Weight Training',
    description: 'Build strength and muscle with our state-of-the-art weight training equipment and expert guidance.',
    color: '#ef4444',
  },
  {
    icon: <Heart size={28} />,
    title: 'Cardio Zone',
    description: 'Burn calories and boost endurance with our premium treadmills, bikes, and cardio machines.',
    color: '#f97316',
  },
  {
    icon: <Music size={28} />,
    title: 'Zumba Classes',
    description: 'Dance your way to fitness with our high-energy Zumba sessions led by certified instructors.',
    color: '#a855f7',
  },
  {
    icon: <Leaf size={28} />,
    title: 'Yoga & Meditation',
    description: 'Find balance, flexibility, and inner peace with our yoga and mindfulness programs.',
    color: '#22c55e',
  },
  {
    icon: <User size={28} />,
    title: 'Personal Training',
    description: 'Get personalized workout plans and one-on-one coaching from our certified trainers.',
    color: '#3b82f6',
  },
  {
    icon: <Apple size={28} />,
    title: 'Diet Consultation',
    description: 'Fuel your transformation with personalized diet plans crafted by certified nutritionists.',
    color: '#eab308',
  },
];

const ServiceCards = () => {
  return (
    <section id="services" className="section-padding" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span style={{
              color: '#ef4444', fontSize: 13, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.1em', display: 'block', marginBottom: 12,
            }}>
              What We Offer
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16 }}>
              World-Class <span className="gradient-text">Fitness Services</span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
              Everything you need to transform your body and mind under one roof.
            </p>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20,
                padding: 28,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              whileHover={{
                y: -6,
                borderColor: `${service.color}40`,
                boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${service.color}10`,
              }}
            >
              {/* Subtle corner glow */}
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 80, height: 80,
                background: `radial-gradient(circle, ${service.color}15 0%, transparent 70%)`,
                borderRadius: '0 20px 0 0',
              }} />

              {/* Icon */}
              <div style={{
                width: 56, height: 56,
                background: `${service.color}18`,
                border: `1px solid ${service.color}30`,
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: service.color,
                marginBottom: 20,
              }}>
                {service.icon}
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: 'white' }}>
                {service.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                {service.description}
              </p>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                color: service.color, fontSize: 13, fontWeight: 600,
              }}>
                Learn More <ChevronRight size={15} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
