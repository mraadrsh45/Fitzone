import { Link } from 'react-router-dom';
import { Dumbbell, Camera, Globe2, PlaySquare, MessageCircle, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#060606',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '60px 0 24px',
    }}>
      <div className="container">
        {/* Top CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 20,
          padding: '40px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 24, marginBottom: 60,
        }}>
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
              Ready to Grow Your Gym? 🚀
            </h3>
            <p style={{ color: '#9ca3af', fontSize: 15 }}>
              Join 500+ gym owners using FitZone AI for marketing automation.
            </p>
          </div>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: 15, padding: '14px 28px' }}>
              Get Started Free <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {/* Links */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 40, marginBottom: 48,
        }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38,
                background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Dumbbell size={20} color="white" />
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Outfit' }}>
                FitZone <span style={{ color: '#ef4444' }}>AI</span>
              </span>
            </div>
            <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              India's #1 AI-powered gym marketing platform. Generate content, track leads, 
              and grow your fitness business with AI.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { Icon: Camera, color: '#e1306c', label: 'Instagram' },
                { Icon: Globe2, color: '#1877f2', label: 'Facebook' },
                { Icon: PlaySquare, color: '#ff0000', label: 'YouTube' },
                { Icon: MessageCircle, color: '#1da1f2', label: 'Twitter' },
              ].map(({ Icon, color }, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6b7280', transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.borderColor = `${color}40`; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 16 }}>Platform</h4>
            {['Dashboard', 'AI Generator', 'SEO Tools', 'Analytics', 'Lead Management', 'Settings'].map(link => (
              <a key={link} href="#" style={{
                display: 'block', color: '#6b7280', textDecoration: 'none',
                fontSize: 13, marginBottom: 10, transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = '#ef4444'}
                onMouseLeave={e => e.target.style.color = '#6b7280'}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Gym */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 16 }}>Gym Services</h4>
            {['Weight Training', 'Cardio Zone', 'Yoga Classes', 'Zumba', 'Personal Training', 'Diet Consultation'].map(link => (
              <a key={link} href="#services" style={{
                display: 'block', color: '#6b7280', textDecoration: 'none',
                fontSize: 13, marginBottom: 10, transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = '#ef4444'}
                onMouseLeave={e => e.target.style.color = '#6b7280'}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 16 }}>Company</h4>
            {['About Us', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'].map(link => (
              <a key={link} href="#" style={{
                display: 'block', color: '#6b7280', textDecoration: 'none',
                fontSize: 13, marginBottom: 10, transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = '#ef4444'}
                onMouseLeave={e => e.target.style.color = '#6b7280'}
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ color: '#4b5563', fontSize: 13 }}>
            © 2024 FitZone AI. All rights reserved. Made with ❤️ for Gym Owners.
          </p>
          <p style={{ color: '#374151', fontSize: 13 }}>
            Powered by <span style={{ color: '#ef4444' }}>OpenAI</span> &amp; <span style={{ color: '#ef4444' }}>Supabase</span>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
