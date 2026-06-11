import { motion } from 'framer-motion';
import { Check, Zap, Crown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Basic',
    price: '₹999',
    period: '/month',
    description: 'Perfect for beginners starting their fitness journey',
    icon: <Star size={22} />,
    color: '#6b7280',
    features: [
      'Access to all gym equipment',
      'Locker room access',
      'Group fitness classes (2/week)',
      'Basic fitness assessment',
      'Mobile app access',
    ],
    cta: 'Get Basic',
    featured: false,
  },
  {
    name: 'Pro',
    price: '₹2,499',
    period: '/3 months',
    description: 'Most popular — ideal for serious fitness enthusiasts',
    icon: <Zap size={22} />,
    color: '#ef4444',
    features: [
      'Everything in Basic',
      'Unlimited group classes',
      '2 Personal training sessions/month',
      'Diet & nutrition consultation',
      'Progress tracking app',
      'Guest passes (2/month)',
      'Priority equipment access',
    ],
    cta: 'Get Pro — Best Value',
    featured: true,
  },
  {
    name: 'Elite',
    price: '₹7,999',
    period: '/year',
    description: 'Full-access annual membership with premium perks',
    icon: <Crown size={22} />,
    color: '#f97316',
    features: [
      'Everything in Pro',
      'Unlimited personal training',
      'Custom meal plans monthly',
      'Body composition analysis',
      'Spa & recovery zone',
      'Unlimited guest passes',
      'Priority booking & support',
      '24/7 gym access',
    ],
    cta: 'Get Elite',
    featured: false,
  },
];

const PricingCards = () => {
  return (
    <section id="pricing" className="section-padding">
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
              Membership Plans
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16 }}>
              Choose Your <span className="gradient-text">Power Plan</span>
            </h2>
            <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              Affordable plans for every fitness goal. Cancel anytime. No hidden fees.
            </p>
          </motion.div>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: 24,
          alignItems: 'start',
        }}>
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`pricing-card ${plan.featured ? 'featured' : ''}`}
              style={{ position: 'relative' }}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  borderRadius: 20, padding: '6px 20px',
                  fontSize: 12, fontWeight: 700, color: 'white',
                  whiteSpace: 'nowrap',
                }}>
                  🔥 Most Popular
                </div>
              )}

              {/* Plan icon */}
              <div style={{
                width: 50, height: 50,
                background: `${plan.color}18`,
                border: `1px solid ${plan.color}35`,
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: plan.color, marginBottom: 20,
              }}>
                {plan.icon}
              </div>

              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{plan.name}</h3>
              <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>{plan.description}</p>

              {/* Price */}
              <div style={{ marginBottom: 28 }}>
                <span style={{ fontSize: 40, fontWeight: 900, color: plan.color }}>{plan.price}</span>
                <span style={{ color: '#6b7280', fontSize: 14 }}>{plan.period}</span>
              </div>

              {/* Features */}
              <ul style={{ listStyle: 'none', marginBottom: 32 }}>
                {plan.features.map((feature, j) => (
                  <li key={j} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    fontSize: 14, color: '#d1d5db',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: `${plan.color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Check size={11} color={plan.color} strokeWidth={3} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/register" style={{ textDecoration: 'none', display: 'block' }}>
                <button
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 10,
                    border: plan.featured ? 'none' : `1px solid ${plan.color}40`,
                    background: plan.featured
                      ? 'linear-gradient(135deg, #ef4444, #b91c1c)'
                      : `${plan.color}12`,
                    color: plan.featured ? 'white' : plan.color,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 10px 25px ${plan.color}30`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingCards;
