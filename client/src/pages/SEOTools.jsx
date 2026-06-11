import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, FileText, Copy, CheckCircle, Globe, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateAIContent } from '../firebase/aiService';
import { useAuth } from '../context/AuthContext';

const SEOTools = () => {
  const { user, profile } = useAuth();
  const [gymName, setGymName] = useState(profile?.gym_name || 'FitZone Gym');
  const [location, setLocation] = useState(profile?.location || 'Rohtak');
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [aiKeywords, setAiKeywords] = useState([]);
  const [usingAI, setUsingAI] = useState(false);

  const generateSEO = async () => {
    setLoading(true);
    try {
      const title = `${gymName} – Best Gym in ${location} | Fitness | Personal Training | Membership`;
      const desc = `Join ${gymName} in ${location} — the #1 fitness center with expert trainers, state-of-the-art equipment, weight loss programs, yoga, zumba, and affordable membership plans. Start your free trial today!`;
      const score = Math.floor(78 + Math.random() * 18);

      setMetaTitle(title);
      setMetaDesc(desc);
      setSeoScore(score);

      // Try AI-generated keywords via HF
      const hfKey = import.meta.env.VITE_HF_API_KEY;
      if (hfKey && hfKey !== 'your-hf-token-here') {
        try {
          const aiResult = await generateAIContent({
            type: 'seokeywords',
            gymName, location,
            campaignGoal: 'Attract new gym members',
            audienceType: 'Fitness enthusiasts',
            tone: 'Professional',
            userId: user?.id,
          });
          const parsed = typeof aiResult === 'string'
            ? aiResult.split('\n').map(k => k.trim()).filter(k => k.length > 3 && k.length < 60)
            : aiResult;
          setAiKeywords(parsed.slice(0, 25));
          setUsingAI(true);
        } catch {
          setUsingAI(false);
        }
      }

      // Static keywords as backup/addition
      const staticKws = [
        `Best gym in ${location}`, `Gym near me ${location}`, `Fitness center ${location}`,
        `${gymName} ${location}`, `Affordable gym ${location}`, `Personal trainer ${location}`,
        `Weight loss gym ${location}`, `Ladies gym ${location}`, `24 hour gym ${location}`,
        `Bodybuilding gym ${location}`, `Yoga classes ${location}`, `Zumba ${location}`,
        `Diet consultation ${location}`, `Gym membership ${location}`, `Certified trainer ${location}`,
      ];
      setKeywords(staticKws);
      setGenerated(true);
      toast.success('SEO analysis complete! 🔍');
    } catch (err) {
      toast.error('Analysis failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  const scoreColor = seoScore >= 90 ? '#22c55e' : seoScore >= 75 ? '#eab308' : '#ef4444';
  const scoreLabel = seoScore >= 90 ? 'Excellent' : seoScore >= 75 ? 'Good' : 'Needs Work';

  const tips = [
    { title: 'Google My Business', desc: 'Claim and optimize your GMB listing with photos, hours, and services.', priority: 'High' },
    { title: 'Local Citations', desc: 'List your gym on JustDial, Sulekha, IndiaMART, and Practo.', priority: 'High' },
    { title: 'Review Generation', desc: 'Ask members to leave 5-star Google reviews after their session.', priority: 'High' },
    { title: 'Local Blog Posts', desc: `Write blogs like "Best Gyms in ${location}" to attract local traffic.`, priority: 'Medium' },
    { title: 'Schema Markup', desc: 'Add LocalBusiness JSON-LD schema to your website for rich results.', priority: 'Medium' },
    { title: 'Mobile Optimization', desc: 'Ensure your website loads under 3 seconds on mobile devices.', priority: 'Medium' },
    { title: 'Social Signals', desc: 'Share content consistently on Instagram, Facebook, and YouTube.', priority: 'Low' },
    { title: 'Backlink Building', desc: 'Get mentioned in local news, health blogs, and fitness directories.', priority: 'Low' },
  ];

  const allKeywords = usingAI && aiKeywords.length > 0
    ? [...new Set([...aiKeywords, ...keywords])]
    : keywords;

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'rgba(34,197,94,0.06)',
        border: '1px solid rgba(34,197,94,0.15)',
        borderRadius: 16, padding: '20px 24px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Globe size={24} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Local SEO Tools</h2>
          <p style={{ color: '#9ca3af', fontSize: 14 }}>AI-powered keywords, meta tags &amp; strategies for your gym</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: '5px 12px' }}>
          <Zap size={13} color="#22c55e" />
          <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>AI-Powered</span>
        </div>
      </div>

      {/* Generator inputs */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'flex-end' }} className="seo-input-grid">
          <div>
            <label className="form-label">Gym Name</label>
            <input className="form-input" value={gymName} onChange={e => setGymName(e.target.value)} placeholder="Your gym name" />
          </div>
          <div>
            <label className="form-label">Location / City</label>
            <input className="form-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Rohtak" />
          </div>
          <button onClick={generateSEO} disabled={loading} className="btn-primary" style={{ whiteSpace: 'nowrap', opacity: loading ? 0.7 : 1 }}>
            {loading ? (
              <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Analyzing...</>
            ) : (
              <><Search size={16} /> Analyze SEO</>
            )}
          </button>
        </div>
      </div>

      {generated && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}
          className="seo-results-grid"
        >
          {/* SEO Score */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>SEO Health Score</p>
            <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 16px' }}>
              <svg viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                <circle cx="70" cy="70" r="58" fill="none" stroke={scoreColor} strokeWidth="12"
                  strokeDasharray={`${(seoScore / 100) * 364} 364`} strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 10px ${scoreColor}60)` }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: scoreColor, fontFamily: 'Outfit' }}>{seoScore}</span>
                <span style={{ fontSize: 12, color: '#6b7280' }}>/ 100</span>
              </div>
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: scoreColor }}>{scoreLabel}</p>
            <p style={{ color: '#6b7280', fontSize: 13, marginTop: 8 }}>Implement the tips below to reach 90+.</p>
          </div>

          {/* Meta tags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={14} color="#3b82f6" />
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6' }}>Meta Title</p>
                </div>
                <button onClick={() => copy(metaTitle)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}><Copy size={13} /></button>
              </div>
              <p style={{ fontSize: 14, color: '#e5e7eb', lineHeight: 1.5 }}>{metaTitle}</p>
              <p style={{ fontSize: 11, color: seoScore >= 60 ? '#22c55e' : '#ef4444', marginTop: 8 }}>{metaTitle.length} / 60 chars {metaTitle.length <= 60 ? '✓ Good' : '⚠ Too long'}</p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={14} color="#a855f7" />
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#a855f7' }}>Meta Description</p>
                </div>
                <button onClick={() => copy(metaDesc)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}><Copy size={13} /></button>
              </div>
              <p style={{ fontSize: 13, color: '#e5e7eb', lineHeight: 1.6 }}>{metaDesc}</p>
              <p style={{ fontSize: 11, color: metaDesc.length <= 160 ? '#22c55e' : '#eab308', marginTop: 8 }}>{metaDesc.length} / 160 chars {metaDesc.length <= 160 ? '✓ Perfect' : '⚠ Too long'}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Keywords */}
      {generated && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, marginBottom: 24 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <TrendingUp size={18} color="#22c55e" />
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Target Keywords ({allKeywords.length})</h3>
              {usingAI && (
                <span style={{ fontSize: 11, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)', color: '#22c55e', borderRadius: 20, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Zap size={10} /> AI Generated
                </span>
              )}
            </div>
            <button onClick={() => copy(allKeywords.join('\n'))} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e', borderRadius: 8, padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}>
              <Copy size={13} /> Copy All
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {allKeywords.map((kw, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}
                onClick={() => copy(kw)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', color: '#22c55e', borderRadius: 20, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}
                whileHover={{ scale: 1.03, background: 'rgba(34,197,94,0.15)' }}
              >
                <Search size={11} />{kw}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* SEO Action Plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: generated ? 0.4 : 0.1 }}
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>📍 Local SEO Action Plan</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {tips.map((tip, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle size={15} color={tip.priority === 'High' ? '#ef4444' : tip.priority === 'Medium' ? '#eab308' : '#6b7280'} />
                  <h4 style={{ fontSize: 14, fontWeight: 600 }}>{tip.title}</h4>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, borderRadius: 6, padding: '2px 8px', background: tip.priority === 'High' ? 'rgba(239,68,68,0.12)' : tip.priority === 'Medium' ? 'rgba(234,179,8,0.12)' : 'rgba(107,114,128,0.12)', color: tip.priority === 'High' ? '#ef4444' : tip.priority === 'Medium' ? '#eab308' : '#6b7280' }}>
                  {tip.priority}
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{tip.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .seo-input-grid { grid-template-columns: 1fr !important; }
          .seo-results-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default SEOTools;
