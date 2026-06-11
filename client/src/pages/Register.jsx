import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Mail, Lock, User, Building2, Eye, EyeOff, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', gymName: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [step, setStep] = useState(1); // 1=form, 2=verify
  const { user, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await register(form.email, form.password, form.name, form.gymName);
      if (data?.session) {
        toast.success('Registration successful! Welcome to FitZone! 💪');
        navigate('/dashboard');
      } else {
        setStep(2);
        toast.success('Account created! Check your email to verify. 🎉');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch {
      toast.error('Google sign-in failed');
      setGoogleLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Check size={36} color="#22c55e" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Verify Your Email</h1>
          <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            We sent a confirmation email to <strong style={{ color: 'white' }}>{form.email}</strong>. 
            Click the link in your email to activate your account.
          </p>

          {/* Firebase tip */}
          <div style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: 12,
            padding: 16,
            textAlign: 'left',
            marginBottom: 28,
          }}>
            <p style={{ color: '#9ca3af', fontSize: 13, lineHeight: 1.5, margin: 0 }}>
              Powered by <strong>Firebase Auth</strong>
            </p>
          </div>

          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ margin: '0 auto', display: 'inline-flex' }}>
              Go to Login <ArrowRight size={16} />
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      backgroundImage: `
        radial-gradient(ellipse at 70% 30%, rgba(239,68,68,0.1) 0%, transparent 60%),
        radial-gradient(ellipse at 20% 80%, rgba(239,68,68,0.06) 0%, transparent 50%)
      `,
    }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #ef4444, #b91c1c)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dumbbell size={24} color="white" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'white', fontFamily: 'Outfit' }}>
              FitZone <span style={{ color: '#ef4444' }}>AI</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Create your account</h1>
          <p style={{ color: '#6b7280', fontSize: 15 }}>Start growing your gym with AI — it's free</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 36 }}>
          {/* Google OAuth */}
          <button onClick={handleGoogle} disabled={googleLoading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, padding: '12px', color: 'white',
              fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 20,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            {googleLoading ? 'Redirecting...' : 'Sign up with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: '#4b5563', fontSize: 12 }}>or register with email</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  <input id="reg-name" className="form-input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ paddingLeft: 36 }} required />
                </div>
              </div>
              <div>
                <label className="form-label">Gym Name</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  <input id="reg-gym" className="form-input" placeholder="Gym name" value={form.gymName} onChange={e => setForm({ ...form, gymName: e.target.value })} style={{ paddingLeft: 36 }} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                <input id="reg-email" className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ paddingLeft: 36 }} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
              <div>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  <input id="reg-password" className="form-input" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 chars" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingLeft: 36, paddingRight: 36 }} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  <input id="reg-confirm" className="form-input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} style={{ paddingLeft: 36 }} required />
                </div>
              </div>
            </div>

            <button type="submit" id="register-submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating account...' : <><span>Create Free Account</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ color: '#374151', fontSize: 12, textAlign: 'center', margin: '14px 0 0' }}>
            By registering, you agree to our{' '}
            <a href="#" style={{ color: '#ef4444', textDecoration: 'none' }}>Terms</a> &{' '}
            <a href="#" style={{ color: '#ef4444', textDecoration: 'none' }}>Privacy Policy</a>
          </p>
          <div style={{ textAlign: 'center', marginTop: 14, color: '#374151', fontSize: 13 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 600 }}>Sign in →</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
