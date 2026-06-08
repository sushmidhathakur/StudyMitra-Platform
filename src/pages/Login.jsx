import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
      toast.success('Welcome to StudyMitra! 🎓');
    } catch (e) {
      toast.error(e.message || 'Google sign-in failed');
    } finally { setLoading(false); }
  }

  async function handleEmailAuth(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'reset') {
        await resetPassword(email);
        toast.success('Password reset email sent!');
        setMode('login');
        return;
      }
      if (mode === 'signup') {
        await signUpWithEmail(email, password, displayName);
        toast.success('Account created! Welcome aboard 🎉');
      } else {
        await signInWithEmail(email, password);
        toast.success('Welcome back! 👋');
      }
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.message?.replace('Firebase: ', '').replace(/\(.*\)/, '').trim() || 'Authentication failed');
    } finally { setLoading(false); }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(79,142,247,0.2) 0%, transparent 60%), #05070f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* BG Orbs */}
      <div className="orb orb-blue" style={{ opacity: 0.3 }} />
      <div className="orb orb-green" style={{ opacity: 0.2 }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 40 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, #4f8ef7, #22c55e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 900, color: 'white',
          }}>S</div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9' }}>StudyMitra</span>
        </Link>

        {/* Card */}
        <div className="glass-strong" style={{ padding: 36 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: 6 }}>
            {mode === 'login' && 'Welcome Back 👋'}
            {mode === 'signup' && 'Join StudyMitra 🎓'}
            {mode === 'reset' && 'Reset Password 🔑'}
          </h1>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', marginBottom: 28 }}>
            {mode === 'login' && 'Sign in to continue your learning journey'}
            {mode === 'signup' && 'Start your personal learning journey today'}
            {mode === 'reset' && "We'll send you a reset link"}
          </p>

          {/* Google Button */}
          {mode !== 'reset' && (
            <>
              <button
                onClick={handleGoogle}
                disabled={loading}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  padding: '13px 20px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12, color: '#f1f5f9',
                  fontWeight: 600, fontSize: '0.95rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.06)'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ fontSize: '0.75rem', color: '#475569' }}>or with email</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth}>
            {mode === 'signup' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input
                    type="text" className="input-glass" required
                    style={{ paddingLeft: 42 }}
                    placeholder="Your name"
                    value={displayName} onChange={e => setDisplayName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type="email" className="input-glass" required
                  style={{ paddingLeft: 42 }}
                  placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input
                    type={showPass ? 'text' : 'password'} className="input-glass" required
                    style={{ paddingLeft: 42, paddingRight: 42 }}
                    placeholder="Your password"
                    value={password} onChange={e => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              {mode === 'login' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Send Reset Email'}
            </button>
          </form>

          {/* Footer links */}
          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#475569' }}>
            {mode === 'login' && (
              <>
                <button onClick={() => setMode('reset')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4f8ef7', fontFamily: 'Inter, sans-serif' }}>Forgot password?</button>
                <span style={{ margin: '0 8px' }}>·</span>
                <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4f8ef7', fontFamily: 'Inter, sans-serif' }}>Create account</button>
              </>
            )}
            {mode === 'signup' && (
              <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4f8ef7', fontFamily: 'Inter, sans-serif' }}>Already have an account? Sign in</button>
            )}
            {mode === 'reset' && (
              <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4f8ef7', fontFamily: 'Inter, sans-serif' }}>Back to sign in</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
