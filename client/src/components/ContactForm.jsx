import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { createLead } from '../supabase/leads';
import toast from 'react-hot-toast';

const ContactForm = () => {
  const [form, setForm] = useState({ customer_name: '', email: '', phone: '', fitness_goal: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createLead({ ...form, source: 'Contact Form', status: 'new' });
      setSent(true);
      toast.success('Message sent! We\'ll contact you shortly. 🎉');
    } catch (err) {
      // Silently save or show error
      toast.error('Failed to submit. Please try calling us directly.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <Phone size={18} />, label: 'Phone', value: '+91 98765 43210', color: '#22c55e' },
    { icon: <Mail size={18} />, label: 'Email', value: 'hello@fitzoneai.com', color: '#3b82f6' },
    { icon: <MapPin size={18} />, label: 'Location', value: 'Sector 14, Rohtak, Haryana 124001', color: '#ef4444' },
  ];

  return (
    <section id="contact" style={{ padding: '80px 0', background: 'rgba(239,68,68,0.02)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span style={{ color: '#ef4444', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>
              Get In Touch
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16 }}>
              Start Your <span className="gradient-text">Free Trial Today</span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              Drop your details and our team will reach out within 24 hours with a personalized demo.
            </p>
          </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 40, alignItems: 'start', maxWidth: 960, margin: '0 auto' }}
          className="contact-grid"
        >
          {/* Contact info */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 32, marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Contact Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {contactInfo.map((info, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 44, height: 44, flexShrink: 0, background: `${info.color}15`, border: `1px solid ${info.color}25`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: info.color }}>
                      {info.icon}
                    </div>
                    <div>
                      <p style={{ color: '#6b7280', fontSize: 12, marginBottom: 2 }}>{info.label}</p>
                      <p style={{ fontWeight: 500, fontSize: 14 }}>{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>🕐 Gym Hours</h4>
              {[['Mon – Fri', '5:00 AM – 11:00 PM'], ['Saturday', '6:00 AM – 10:00 PM'], ['Sunday', '7:00 AM – 8:00 PM']].map(([day, time]) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
                  <span style={{ color: '#9ca3af' }}>{day}</span>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>{time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 32 }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Send size={32} color="#22c55e" />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>We got your message!</h3>
                  <p style={{ color: '#6b7280', fontSize: 15, marginBottom: 20 }}>Our team will contact you within 24 hours with a personalized demo of FitZone AI.</p>
                  <button onClick={() => setSent(false)} className="btn-secondary">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MessageSquare size={18} color="#ef4444" /> Book a Free Demo
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input id="contact-name" className="form-input" placeholder="Your name" value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} required />
                    </div>
                    <div>
                      <label className="form-label">Phone *</label>
                      <input id="contact-phone" className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                    </div>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <label className="form-label">Email *</label>
                    <input id="contact-email" className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <label className="form-label">Fitness Goal</label>
                    <select id="contact-goal" className="form-input" value={form.fitness_goal} onChange={e => setForm({ ...form, fitness_goal: e.target.value })}>
                      <option value="">I want to...</option>
                      <option>Lose Weight</option>
                      <option>Build Muscle</option>
                      <option>Get Fit & Healthy</option>
                      <option>Improve Endurance</option>
                      <option>Manage My Gym with AI</option>
                    </select>
                  </div>
                  <div style={{ marginTop: 14, marginBottom: 24 }}>
                    <label className="form-label">Message (Optional)</label>
                    <textarea id="contact-msg" className="form-input" rows={3} placeholder="Tell us about your gym or fitness needs..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ resize: 'vertical' }} />
                  </div>
                  <button type="submit" id="contact-submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                    {loading ? 'Sending...' : <><Send size={16} /> Send Message</>}
                  </button>
                  <p style={{ color: '#4b5563', fontSize: 12, textAlign: 'center', marginTop: 12 }}>
                    Your data is securely stored via Supabase. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
};

export default ContactForm;
