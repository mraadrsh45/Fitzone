import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ankur Mehta',
    role: 'Lost 18kg in 4 months',
    text: 'FitZone completely transformed my life. The trainers are world-class and the facilities are top-notch. I never thought I could achieve this body at 35!',
    rating: 5,
    initials: 'AM',
    color: '#ef4444',
  },
  {
    name: 'Sunita Yadav',
    role: 'Gained 8kg Muscle Mass',
    text: 'The personal training program here is exceptional. My trainer Rahul created a customized plan that helped me gain lean muscle while staying injury-free.',
    rating: 5,
    initials: 'SY',
    color: '#a855f7',
  },
  {
    name: 'Deepak Joshi',
    role: 'Completed Marathon',
    text: 'The cardio training program prepared me for my first marathon. The coaches are incredibly supportive and knowledgeable. Highly recommend FitZone!',
    rating: 5,
    initials: 'DJ',
    color: '#f97316',
  },
  {
    name: 'Kavita Sharma',
    role: 'Yoga Transformation',
    text: "The yoga classes here are phenomenal. Priya's teaching style is so calming yet effective. I've improved my flexibility and stress levels dramatically.",
    rating: 5,
    initials: 'KS',
    color: '#22c55e',
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section-padding">
      <div className="container">
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
              Success Stories
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16 }}>
              Real <span className="gradient-text">Transformations</span>
            </h2>
          </motion.div>
        </div>

        {/* Testimonial Card */}
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 24,
                padding: '48px 40px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Quote icon */}
              <Quote
                size={48}
                style={{
                  position: 'absolute', top: 24, left: 24,
                  color: testimonials[current].color,
                  opacity: 0.2,
                }}
              />

              {/* Stars */}
              <div style={{ marginBottom: 24 }}>
                {Array(testimonials[current].rating).fill(0).map((_, i) => (
                  <span key={i} style={{ color: '#eab308', fontSize: 20 }}>★</span>
                ))}
              </div>

              <p style={{
                fontSize: 18, color: '#e5e7eb', lineHeight: 1.7,
                marginBottom: 32, fontStyle: 'italic',
              }}>
                "{testimonials[current].text}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52,
                  background: `linear-gradient(135deg, ${testimonials[current].color}, ${testimonials[current].color}88)`,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, color: 'white',
                }}>
                  {testimonials[current].initials}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontWeight: 700, color: 'white' }}>{testimonials[current].name}</p>
                  <p style={{ color: testimonials[current].color, fontSize: 13 }}>
                    {testimonials[current].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 28 }}>
            <button onClick={prev} style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div style={{ display: 'flex', gap: 8 }}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  style={{
                    width: i === current ? 24 : 8, height: 8,
                    borderRadius: 4,
                    background: i === current ? '#ef4444' : 'rgba(255,255,255,0.15)',
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>

            <button onClick={next} style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
