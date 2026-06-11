import { motion } from 'framer-motion';
import { TrendingUp, Award } from 'lucide-react';

const transformations = [
  { name: 'Ankur M.', before: '-18kg', after: '6 Pack', duration: '4 months', color: '#ef4444', initials: 'AM', goal: 'Fat Loss' },
  { name: 'Sunita Y.', before: 'Weak', after: '+8kg Muscle', duration: '5 months', color: '#a855f7', initials: 'SY', goal: 'Muscle Gain' },
  { name: 'Deepak J.', before: 'Unfit', after: 'Marathon', duration: '6 months', color: '#f97316', initials: 'DJ', goal: 'Endurance' },
  { name: 'Kavita S.', before: 'Stressed', after: 'Balanced', duration: '3 months', color: '#22c55e', initials: 'KS', goal: 'Yoga' },
  { name: 'Rahul K.', before: 'Obese', after: '-22kg', duration: '7 months', color: '#3b82f6', initials: 'RK', goal: 'Weight Loss' },
  { name: 'Priya M.', before: 'Beginner', after: 'Pro Athlete', duration: '8 months', color: '#eab308', initials: 'PM', goal: 'Performance' },
];

const Gallery = () => {
  return (
    <section id="gallery" style={{ padding: '80px 0', background: '#0a0a0a' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span style={{ color: '#ef4444', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>
              Transformation Gallery
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16 }}>
              Real <span className="gradient-text">Transformations</span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              Our members' journeys speak louder than words. See the incredible results achieved at FitZone.
            </p>
          </motion.div>
        </div>

        {/* Masonry-style grid */}
        <div style={{ columns: 3, columnGap: 20 }} className="gallery-masonry">
          {transformations.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                breakInside: 'avoid',
                marginBottom: 20,
                background: `linear-gradient(135deg, ${t.color}15, ${t.color}05)`,
                border: `1px solid ${t.color}25`,
                borderRadius: 20,
                padding: 28,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              {/* Before/After visual */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {/* Before */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ width: '100%', aspectRatio: '1', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(107,114,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#9ca3af', marginBottom: 6 }}>{t.initials}</div>
                    <span style={{ fontSize: 11, color: '#6b7280' }}>Before</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{t.before}</p>
                </div>

                {/* Arrow */}
                <div style={{ display: 'flex', alignItems: 'center', color: t.color, fontSize: 20, fontWeight: 800 }}>→</div>

                {/* After */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ width: '100%', aspectRatio: '1', background: `${t.color}15`, border: `1px solid ${t.color}30`, borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 6, boxShadow: `0 0 20px ${t.color}40` }}>{t.initials}</div>
                    <span style={{ fontSize: 11, color: t.color, fontWeight: 600 }}>After</span>
                  </div>
                  <p style={{ fontSize: 13, color: t.color, fontWeight: 700 }}>{t.after}</p>
                </div>
              </div>

              {/* Info */}
              <div style={{ borderTop: `1px solid ${t.color}20`, paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: t.color, fontSize: 12, fontWeight: 600 }}>
                    <Award size={13} /> {t.goal}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <TrendingUp size={13} color={t.color} />
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>Transformed in <strong style={{ color: t.color }}>{t.duration}</strong></span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginTop: 48 }}
        >
          <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 20 }}>
            Ready to start your transformation? Join hundreds of members who achieved their goals.
          </p>
          <a href="#contact" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: 15, padding: '14px 32px' }}>
              Start My Transformation 💪
            </button>
          </a>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) { .gallery-masonry { columns: 2 !important; } }
        @media (max-width: 600px) { .gallery-masonry { columns: 1 !important; } }
      `}</style>
    </section>
  );
};

export default Gallery;
