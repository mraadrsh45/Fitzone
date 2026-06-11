import { motion } from 'framer-motion';
import { Share2, MessageSquare, Play } from 'lucide-react';

const trainers = [
  {
    name: 'Rahul Sharma',
    specialization: 'Strength & Bodybuilding',
    experience: '8 Years',
    certifications: 'NSCA, ACE Certified',
    bgColor: '#ef4444',
    initials: 'RS',
    rating: 4.9,
  },
  {
    name: 'Priya Singh',
    specialization: 'Yoga & Mindfulness',
    experience: '6 Years',
    certifications: 'RYT-500, Meditation Expert',
    bgColor: '#a855f7',
    initials: 'PS',
    rating: 5.0,
  },
  {
    name: 'Vikram Patel',
    specialization: 'Cardio & Weight Loss',
    experience: '10 Years',
    certifications: 'ACSM, ISSA Certified',
    bgColor: '#f97316',
    initials: 'VP',
    rating: 4.8,
  },
  {
    name: 'Neha Gupta',
    specialization: 'Zumba & Dance Fitness',
    experience: '5 Years',
    certifications: 'Zumba Instructor Level 2',
    bgColor: '#3b82f6',
    initials: 'NG',
    rating: 4.9,
  },
];

const TrainerCards = () => {
  return (
    <section id="trainers" className="section-padding" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span style={{
              color: '#ef4444', fontSize: 13, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              display: 'block', marginBottom: 12,
            }}>
              Expert Team
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16 }}>
              Meet Our <span className="gradient-text">Elite Trainers</span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              Certified professionals dedicated to your transformation journey.
            </p>
          </motion.div>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
        }}>
          {trainers.map((trainer, i) => (
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
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              whileHover={{
                y: -8,
                borderColor: `${trainer.bgColor}40`,
              }}
            >
              {/* Avatar */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                <div style={{
                  width: 90, height: 90,
                  background: `linear-gradient(135deg, ${trainer.bgColor}, ${trainer.bgColor}88)`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 800, color: 'white',
                  fontFamily: 'Outfit',
                  margin: '0 auto',
                  boxShadow: `0 0 30px ${trainer.bgColor}30`,
                }}>
                  {trainer.initials}
                </div>
                {/* Rating badge */}
                <div style={{
                  position: 'absolute', bottom: 0, right: -4,
                  background: '#111',
                  border: `2px solid ${trainer.bgColor}`,
                  borderRadius: 10, padding: '2px 6px',
                  fontSize: 11, fontWeight: 700, color: trainer.bgColor,
                }}>
                  ★ {trainer.rating}
                </div>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{trainer.name}</h3>
              <p style={{ color: trainer.bgColor, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                {trainer.specialization}
              </p>
              <p style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>
                {trainer.experience} Experience
              </p>
              <p style={{ color: '#4b5563', fontSize: 11, marginBottom: 20 }}>
                {trainer.certifications}
              </p>

              {/* Social icons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                {[Share2, MessageSquare, Play].map((Icon, j) => (
                  <div
                    key={j}
                    style={{
                      width: 32, height: 32,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#6b7280',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${trainer.bgColor}20`;
                      e.currentTarget.style.color = trainer.bgColor;
                      e.currentTarget.style.borderColor = `${trainer.bgColor}40`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = '#6b7280';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    }}
                  >
                    <Icon size={14} />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrainerCards;
