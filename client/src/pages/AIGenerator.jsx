import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Copy, Save, RefreshCw, Camera, Megaphone,
  BookOpen, Hash, Search, Mail, Film, CheckCircle, Trash2
} from 'lucide-react';
import { generateAIContent, getSavedContent, deleteContent, saveContent } from '../firebase/aiService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const tools = [
  { id: 'caption', label: 'Instagram Caption', icon: <Camera size={16} />, color: '#e1306c' },
  { id: 'hashtags', label: 'Hashtags', icon: <Hash size={16} />, color: '#a855f7' },
  { id: 'adcopy', label: 'Ad Copy', icon: <Megaphone size={16} />, color: '#f97316' },
  { id: 'blogideas', label: 'Blog Ideas', icon: <BookOpen size={16} />, color: '#3b82f6' },
  { id: 'seokeywords', label: 'SEO Keywords', icon: <Search size={16} />, color: '#22c55e' },
  { id: 'emailcampaign', label: 'Email Campaign', icon: <Mail size={16} />, color: '#eab308' },
  { id: 'reelideas', label: 'Reel Ideas', icon: <Film size={16} />, color: '#ec4899' },
];

const tones = ['Motivational', 'Professional', 'Fun & Casual', 'Urgent', 'Inspirational', 'Bold'];

const AIGenerator = () => {
  const { user, gymName: defaultGym, profile } = useAuth();
  const [activeTool, setActiveTool] = useState('caption');
  const [form, setForm] = useState({
    gymName: defaultGym || 'FitZone Gym',
    campaignGoal: 'Get more members',
    audienceType: 'Young adults 18-35',
    location: profile?.location || 'Rohtak',
    tone: 'Motivational',
  });
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' | 'saved'
  const [savedContent, setSavedContent] = useState([]);

  const currentTool = tools.find(t => t.id === activeTool);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const content = await generateAIContent({
        type: activeTool,
        ...form,
        userId: user?.id,
      });
      setResult(content);
      setHistory(prev => [{ type: activeTool, content, timestamp: new Date() }, ...prev.slice(0, 4)]);
      toast.success('Content generated! ✨');
    } catch (err) {
      toast.error('Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !user) { toast.error(user ? 'Nothing to save' : 'Login to save content'); return; }
    setSaving(true);
    try {
      await saveContent(user.id, {
        content_type: activeTool,
        content: typeof result === 'string' ? result : result.join('\n'),
        gym_name: form.gymName,
        campaign_goal: form.campaignGoal,
        audience_type: form.audienceType,
        location: form.location,
        tone: form.tone,
      });
      toast.success('Saved to your library! 📚');
    } catch {
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const loadSavedContent = async () => {
    if (!user) return;
    try {
      const data = await getSavedContent(user.id);
      setSavedContent(data);
    } catch { }
  };

  const handleDeleteSaved = async (id) => {
    try {
      await deleteContent(id);
      setSavedContent(prev => prev.filter(c => c.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const copy = (text) => {
    const str = Array.isArray(text) ? text.join('\n') : text;
    navigator.clipboard.writeText(str);
    toast.success('Copied!');
  };

  const renderResult = (content) => {
    if (!content) return null;
    const lines = typeof content === 'string' ? content.split('\n').filter(Boolean) : content;

    if (Array.isArray(lines) && lines.length > 1) {
      return (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {lines.map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14, color: '#e5e7eb' }}>
              <CheckCircle size={14} color={currentTool.color} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{item.replace(/^\d+\.\s*/, '')}</span>
            </li>
          ))}
        </ul>
      );
    }

    return <p style={{ fontSize: 15, color: '#e5e7eb', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{typeof content === 'string' ? content : content.join('\n')}</p>;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #ef4444, #b91c1c)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={24} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>AI Marketing Generator</h2>
          <p style={{ color: '#9ca3af', fontSize: 14 }}>Generate powerful gym marketing content in seconds • Powered by OpenAI</p>
        </div>
        {/* Tabs */}
        <div style={{ marginLeft: 'auto', display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 4 }}>
          {[{ id: 'generate', label: 'Generate' }, { id: 'saved', label: 'Saved' }].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); if (tab.id === 'saved') loadSavedContent(); }}
              style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: activeTab === tab.id ? 'rgba(239,68,68,0.8)' : 'transparent', color: activeTab === tab.id ? 'white' : '#9ca3af', transition: 'all 0.2s' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'saved' ? (
          <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {savedContent.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 64, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
                <Save size={40} color="#374151" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: '#6b7280', fontSize: 15 }}>No saved content yet</p>
                <p style={{ color: '#374151', fontSize: 13, marginTop: 8 }}>Generate content and click Save to build your library</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                {savedContent.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 20 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: tools.find(t => t.id === item.content_type)?.color || '#ef4444', background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '2px 8px' }}>
                        {item.content_type}
                      </span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => copy(item.content)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}><Copy size={14} /></button>
                        <button onClick={() => handleDeleteSaved(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.content}
                    </p>
                    <p style={{ fontSize: 11, color: '#4b5563', marginTop: 10 }}>{new Date(item.created_at).toLocaleDateString('en-IN')}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="generate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }} className="ai-grid">
              {/* Left panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Tool selector */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 16 }}>
                  <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Content Type</p>
                  {tools.map(tool => (
                    <button key={tool.id} onClick={() => { setActiveTool(tool.id); setResult(null); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                        padding: '10px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
                        background: activeTool === tool.id ? `${tool.color}15` : 'transparent',
                        borderLeft: activeTool === tool.id ? `3px solid ${tool.color}` : '3px solid transparent',
                        color: activeTool === tool.id ? tool.color : '#6b7280',
                        fontSize: 13, fontWeight: activeTool === tool.id ? 600 : 400, transition: 'all 0.2s', textAlign: 'left',
                      }}
                    >
                      {tool.icon} {tool.label}
                    </button>
                  ))}
                </div>

                {/* Form */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 18 }}>
                  <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Campaign Details</p>
                  {[
                    { label: 'Gym Name', key: 'gymName', placeholder: 'e.g. FitZone Gym' },
                    { label: 'Campaign Goal', key: 'campaignGoal', placeholder: 'e.g. Increase sign-ups' },
                    { label: 'Target Audience', key: 'audienceType', placeholder: 'e.g. Young adults 18-35' },
                    { label: 'Location / City', key: 'location', placeholder: 'e.g. Rohtak' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key} style={{ marginBottom: 12 }}>
                      <label className="form-label">{label}</label>
                      <input className="form-input" placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                    </div>
                  ))}
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Tone Style</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {tones.map(tone => (
                        <button key={tone} onClick={() => setForm({ ...form, tone })}
                          style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${form.tone === tone ? '#ef4444' : 'rgba(255,255,255,0.08)'}`, background: form.tone === tone ? 'rgba(239,68,68,0.15)' : 'transparent', color: form.tone === tone ? '#ef4444' : '#6b7280', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                  </div>
                  <motion.button onClick={handleGenerate} disabled={loading} whileTap={{ scale: 0.97 }} className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Generating...
                      </span>
                    ) : <><Zap size={16} /> Generate {currentTool?.label}</>}
                  </motion.button>
                </div>
              </div>

              {/* Right panel — result */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, minHeight: 420, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ color: currentTool?.color }}>{currentTool?.icon}</div>
                    <h3 style={{ fontSize: 15, fontWeight: 600 }}>Generated {currentTool?.label}</h3>
                  </div>
                  {result && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleGenerate} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', borderRadius: 7, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>
                        <RefreshCw size={12} /> Regenerate
                      </button>
                      <button onClick={() => copy(result)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', borderRadius: 7, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>
                        <Copy size={12} /> Copy
                      </button>
                      <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', borderRadius: 7, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>
                        <Save size={12} /> {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ padding: 24, flex: 1 }}>
                  {loading ? (
                    <div>
                      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 18, width: i === 3 ? '60%' : '100%', marginBottom: 10 }} />)}
                      <p style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginTop: 24 }}>🤖 AI is crafting your content...</p>
                    </div>
                  ) : result ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      {renderResult(result)}
                    </motion.div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 300, textAlign: 'center' }}>
                      <div style={{ width: 64, height: 64, borderRadius: 16, background: `${currentTool?.color}12`, border: `1px solid ${currentTool?.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: currentTool?.color, marginBottom: 16 }}>
                        <Zap size={28} />
                      </div>
                      <p style={{ fontSize: 16, fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>Ready to generate</p>
                      <p style={{ fontSize: 14, color: '#4b5563', maxWidth: 320 }}>Fill your campaign details and click Generate to create AI-powered marketing content.</p>
                    </div>
                  )}
                </div>

                {/* Recent history */}
                {history.length > 0 && !result && (
                  <div style={{ padding: '0 24px 24px' }}>
                    <p style={{ color: '#4b5563', fontSize: 12, marginBottom: 10 }}>Recent generations:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {history.map((h, i) => (
                        <div key={i} onClick={() => setResult(h.content)} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, cursor: 'pointer', fontSize: 12, color: '#9ca3af', display: 'flex', gap: 8 }}>
                          <span style={{ color: tools.find(t => t.id === h.type)?.color }}>{h.type}</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                            {typeof h.content === 'string' ? h.content.substring(0, 60) : h.content[0]}...
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) { .ai-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

export default AIGenerator;
