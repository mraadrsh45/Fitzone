import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Mail, Lock, Eye, EyeOff, ArrowRight, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const { user, login, loginWithGoogle, forgotPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 💪');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      // Redirect happens automatically
    } catch (err) {
      toast.error('Google sign-in failed. Try again.');
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(forgotEmail);
      toast.success('Password reset email sent! Check your inbox.');
      setShowForgot(false);
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      backgroundImage: `
        radial-gradient(ellipse at 30% 50%, rgba(239,68,68,0.1) 0%, transparent 60%),
        radial-gradient(ellipse at 70% 20%, rgba(239,68,68,0.06) 0%, transparent 50%)
      `,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #ef4444, #b91c1c)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dumbbell size={24} color="white" />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'white', fontFamily: 'Outfit' }}>
              FitZone <span style={{ color: '#ef4444' }}>AI</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
            {showForgot ? 'Reset Password' : 'Welcome back!'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: 15 }}>
            {showForgot ? 'Enter your email to receive a reset link' : 'Sign in to your dashboard'}
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 36 }}>
          {showForgot ? (
            <form onSubmit={handleForgotPassword}>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  <input id="forgot-email" className="form-input" type="email" placeholder="you@email.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} style={{ paddingLeft: 40 }} required />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Send Reset Link
              </button>
              <button type="button" onClick={() => setShowForgot(false)} style={{ width: '100%', marginTop: 12, background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 14 }}>
                ← Back to login
              </button>
            </form>
          ) : (
            <>
              {/* Google OAuth */}
              <button
                id="google-login-btn"
                onClick={handleGoogle}
                disabled={googleLoading}
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
                {googleLoading ? 'Redirecting...' : 'Continue with Google'}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ color: '#4b5563', fontSize: 12 }}>or sign in with email</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    <input id="login-email" className="form-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ paddingLeft: 40 }} required />
                  </div>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    <input id="login-password" className="form-input" type={showPassword ? 'text' : 'password'} placeholder="Your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingLeft: 40, paddingRight: 44 }} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'right', marginBottom: 20 }}>
                  <button type="button" onClick={() => setShowForgot(true)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 13, cursor: 'pointer' }}>
                    Forgot password?
                  </button>
                </div>

                <button type="submit" id="login-submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 20, color: '#374151', fontSize: 13 }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 600 }}>Register free →</Link>
              </div>

              {/* Demo hint */}
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: '12px 16px', marginTop: 16 }}>
                <p style={{ color: '#9ca3af', fontSize: 12, marginBottom: 4 }}>💡 Quick start: Register a new account or use Google Sign-In</p>
                <p style={{ color: '#6b7280', fontSize: 11 }}>Powered by <span style={{ color: '#ef4444' }}>Firebase Auth</span></p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
