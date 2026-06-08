import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, Bot, BarChart2, Trophy, Map, BookOpen, Star, Shield, Users } from 'lucide-react';

const FEATURES = [
  { icon: <Map size={22} />, color: '#4f8ef7', title: 'Smart Roadmap Parser', desc: 'Upload PDF, Excel, CSV, DOCX or JSON. Our parser auto-detects your plan structure.' },
  { icon: <Zap size={22} />, color: '#22c55e', title: 'Daily Unlock Progression', desc: 'Linear unlock system — only today\'s topic is active. Focus on one thing at a time.' },
  { icon: <Bot size={22} />, color: '#a855f7', title: 'AI Learning Coach', desc: 'Context-aware AI that knows your roadmap, progress, and weak areas. Ask anything.' },
  { icon: <BarChart2 size={22} />, color: '#f59e0b', title: 'Analytics Dashboard', desc: 'Heatmaps, streak trends, velocity charts and learning insights powered by Chart.js.' },
  { icon: <BookOpen size={22} />, color: '#06b6d4', title: 'Daily Learning Journal', desc: 'Log what you learned, challenges faced, wins, resources and weekly reflections.' },
  { icon: <Trophy size={22} />, color: '#ef4444', title: 'Achievement System', desc: 'Earn badges for streaks, milestones, hours logged and roadmap completions.' },
];

const STATS = [
  { value: '10K+', label: 'Learners' },
  { value: '50K+', label: 'Days Completed' },
  { value: '98%', label: 'Satisfaction' },
  { value: '500+', label: 'Roadmaps Parsed' },
];

const TESTIMONIALS = [
  { name: 'Priya M.', role: 'GATE 2025 Aspirant', text: 'StudyMitra turned my scattered GATE prep notes into a structured 90-day journey. The streak system kept me accountable every single day!', avatar: 'P' },
  { name: 'Rahul K.', role: 'Full-Stack Developer', text: 'I uploaded my DevOps roadmap and it auto-parsed 60 topics into daily tasks. The AI coach helped me when I got stuck on Kubernetes.', avatar: 'R' },
  { name: 'Ananya S.', role: 'CS Student', text: 'The analytics dashboard showed me exactly where I was losing momentum. Completed my DSA roadmap in 45 days!', avatar: 'A' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#05070f', overflowX: 'hidden' }}>
      {/* BG Orbs */}
      <div className="orb orb-blue" />
      <div className="orb orb-green" />
      <div className="orb orb-purple" />

      {/* Navbar */}
      <nav className="glass-nav" style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #4f8ef7, #22c55e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 18, color: 'white',
          }}>S</div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#f1f5f9' }}>StudyMitra</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/login')} className="btn-ghost" style={{ fontSize: '0.875rem' }}>Sign In</button>
          <button onClick={() => navigate('/login')} className="btn-primary" style={{ fontSize: '0.875rem', padding: '9px 20px' }}>
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px', textAlign: 'center', position: 'relative', zIndex: 1,
      }}>
        <div style={{ maxWidth: 800 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.3)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 32,
          }}>
            <Star size={12} color="#f59e0b" fill="#f59e0b" />
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
              Personal Learning Operating System
            </span>
            <span style={{ background: '#4f8ef7', color: 'white', borderRadius: 999, padding: '1px 8px', fontSize: '0.7rem', fontWeight: 700 }}>NEW</span>
          </div>

          <h1 className="hero-text-gradient" style={{
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 24,
            letterSpacing: '-0.02em',
          }}>
            Transform Any Roadmap<br />Into A Guided Journey
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#64748b',
            maxWidth: 580, margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            Upload your study plan. StudyMitra converts it into a day-by-day interactive learning journey with AI coaching, streak tracking, analytics and accountability.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <button onClick={() => navigate('/login')} className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              Start Your Journey <ArrowRight size={18} />
            </button>
            <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="btn-ghost" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              See How It Works
            </button>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(135deg, #4f8ef7, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 12 }}>How StudyMitra Works</h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>Three simple steps to transform your learning</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { step: '01', icon: '📄', title: 'Upload Your Roadmap', desc: 'Upload any format — PDF, Excel, CSV, DOCX, or plain text. Our smart parser extracts all topics automatically.' },
              { step: '02', icon: '🗓️', title: 'Get Your Daily Mission', desc: 'Each day unlocks one topic. Complete today\'s mission by submitting a learning summary to unlock the next.' },
              { step: '03', icon: '📊', title: 'Track & Grow', desc: 'Watch your streak grow, earn achievements, chat with your AI coach, and see your progress in beautiful analytics.' },
            ].map(item => (
              <div key={item.step} className="glass" style={{ padding: 32, textAlign: 'center', position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 20, right: 20,
                  fontSize: '0.7rem', fontWeight: 800, color: '#475569', letterSpacing: '0.1em',
                }}>{item.step}</div>
                <div style={{ fontSize: 48, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 12 }}>Everything You Need</h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>A complete learning operating system, not just another todo app</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="glass" style={{ padding: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${f.color}15`, border: `1px solid ${f.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color, marginBottom: 16,
                }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section style={{ padding: '60px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Upload Any Format</h2>
          <p style={{ color: '#64748b', marginBottom: 32 }}>Our smart parser handles them all</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {['PDF', 'Excel (.xlsx)', 'CSV', 'Word (.docx)', 'Markdown (.md)', 'Plain Text (.txt)', 'JSON'].map(fmt => (
              <div key={fmt} style={{
                padding: '8px 18px',
                background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)',
                borderRadius: 8, fontSize: '0.875rem', color: '#94a3b8', fontWeight: 500,
              }}>{fmt}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: 40 }}>Learners Love StudyMitra</h2>

          <div className="glass-strong" style={{ padding: 36, textAlign: 'center', transition: 'all 0.4s' }}>
            <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.8, marginBottom: 24, fontStyle: 'italic' }}>
              "{TESTIMONIALS[activeTestimonial].text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f8ef7, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: 'white',
              }}>{TESTIMONIALS[activeTestimonial].avatar}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{TESTIMONIALS[activeTestimonial].name}</div>
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>{TESTIMONIALS[activeTestimonial].role}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 20 }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                style={{ width: i === activeTestimonial ? 24 : 8, height: 8, borderRadius: 999, border: 'none', cursor: 'pointer', transition: 'all 0.3s', background: i === activeTestimonial ? '#4f8ef7' : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px 120px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(79,142,247,0.15), rgba(34,197,94,0.1))',
            border: '1px solid rgba(79,142,247,0.2)',
            borderRadius: 24, padding: '60px 40px',
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>Ready to Transform Your Learning?</h2>
            <p style={{ color: '#64748b', marginBottom: 32, lineHeight: 1.7 }}>
              Join thousands of students turning their roadmaps into real progress.
            </p>
            <button onClick={() => navigate('/login')} className="btn-primary" style={{ fontSize: '1.05rem', padding: '15px 36px' }}>
              Start Free Today <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', textAlign: 'center', color: '#475569', fontSize: '0.8rem', position: 'relative', zIndex: 1 }}>
        <span>© 2025 StudyMitra. Built for learners, by learners.</span>
      </footer>
    </div>
  );
}
