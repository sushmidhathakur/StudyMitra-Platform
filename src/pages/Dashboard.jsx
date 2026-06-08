import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRoadmap } from '../contexts/RoadmapContext';
import AppLayout from '../components/AppLayout';
import StatCard from '../components/StatCard';
import { getLevelInfo } from '../utils/xpSystem';
import { getGreeting, formatDate, todayStr } from '../utils/dateHelpers';
import {
  Flame, Zap, CheckCircle2, Clock, Target, TrendingUp,
  Upload, Map, BookOpen, Bot, Trophy, ArrowRight, Lock,
  Calendar, Star, Activity,
} from 'lucide-react';

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  const { roadmap, progress, loading } = useRoadmap();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => { setGreeting(getGreeting()); }, []);

  const displayName = userProfile?.displayName || user?.displayName || 'Learner';
  const xpInfo = getLevelInfo(progress?.xp || 0);
  const completed = progress?.completedDays?.length || 0;
  const total = roadmap?.totalDays || 0;
  const completion = total ? Math.round((completed / total) * 100) : 0;
  const hoursLogged = Math.round((progress?.totalMinutes || 0) / 60 * 10) / 10;
  const currentDay = progress?.currentDay || 1;
  const currentTopic = roadmap?.parsedDays?.[currentDay - 1];

  if (loading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center', color: '#475569' }}>Loading your learning journey...</div>
        </div>
      </AppLayout>
    );
  }

  // No roadmap yet
  if (!roadmap) {
    return (
      <AppLayout>
        <div className="animate-fade-in">
          {/* Greeting */}
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: 4 }}>
              {greeting}, {displayName.split(' ')[0]} 👋
            </h1>
            <p style={{ color: '#64748b' }}>Let's set up your learning journey!</p>
          </div>

          {/* Welcome card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(79,142,247,0.12), rgba(34,197,94,0.08))',
            border: '1px solid rgba(79,142,247,0.25)',
            borderRadius: 24, padding: 48, textAlign: 'center', marginBottom: 40,
          }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🚀</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>
              Welcome to StudyMitra!
            </h2>
            <p style={{ color: '#64748b', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
              Your personal learning operating system is ready. Upload your roadmap to get started — whether it's a GATE prep plan, DevOps path, or any custom study schedule.
            </p>
            <button onClick={() => navigate('/upload')} className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              <Upload size={18} /> Upload Your Roadmap
            </button>
          </div>

          {/* What you can do */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { icon: <Map size={20} />, color: '#4f8ef7', text: 'Daily Unlock Journey' },
              { icon: <Bot size={20} />, color: '#a855f7', text: 'AI Learning Coach' },
              { icon: <Flame size={20} />, color: '#f59e0b', text: 'Streak Tracking' },
              { icon: <Trophy size={20} />, color: '#f59e0b', text: 'Achievement Badges' },
              { icon: <BookOpen size={20} />, color: '#06b6d4', text: 'Learning Journal' },
              { icon: <Activity size={20} />, color: '#22c55e', text: 'Analytics Dashboard' },
            ].map(item => (
              <div key={item.text} className="glass" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ color: item.color }}>{item.icon}</div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#94a3b8' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: 4 }}>
                {greeting}, {displayName.split(' ')[0]} 👋
              </h1>
              <p style={{ color: '#64748b' }}>
                {todayStr() === progress?.lastCompletedDate
                  ? "You've already completed today's mission! 🎉"
                  : "Your learning journey awaits. Let's conquer today's mission!"}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => navigate('/today')} className="btn-primary" style={{ fontSize: '0.875rem', padding: '10px 20px' }}>
                <Zap size={16} /> Today's Mission
              </button>
              <button onClick={() => navigate('/coach')} className="btn-ghost" style={{ fontSize: '0.875rem' }}>
                <Bot size={16} /> AI Coach
              </button>
            </div>
          </div>
        </div>

        {/* Today's Mission Banner */}
        {currentTopic && todayStr() !== progress?.lastCompletedDate && (
          <div
            onClick={() => navigate('/today')}
            style={{
              background: 'linear-gradient(135deg, rgba(79,142,247,0.12), rgba(34,197,94,0.08))',
              border: '1px solid rgba(79,142,247,0.3)',
              borderRadius: 20, padding: '24px 28px', marginBottom: 28,
              cursor: 'pointer', transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', gap: 20,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 16, flexShrink: 0,
              background: 'rgba(79,142,247,0.15)', border: '1px solid rgba(79,142,247,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={24} color="#4f8ef7" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f8ef7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Today's Mission — Day {currentDay}</span>
                <span className="badge-current">Active</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>{currentTopic.topic}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
                ~{currentTopic.estimatedMinutes || 90} min · Complete to unlock Day {currentDay + 1}
              </div>
            </div>
            <ArrowRight size={20} color="#4f8ef7" />
          </div>
        )}

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          <StatCard
            icon={<Flame size={20} />}
            label="Current Streak"
            value={`${progress?.currentStreak || 0}🔥`}
            sub={progress?.longestStreak ? `Best: ${progress.longestStreak}` : null}
            color="#f59e0b"
          />
          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Days Completed"
            value={completed}
            sub={`of ${total}`}
            color="#22c55e"
          />
          <StatCard
            icon={<Target size={20} />}
            label="Completion"
            value={`${completion}%`}
            sub={completion === 100 ? '🎉 Done!' : null}
            color="#4f8ef7"
          />
          <StatCard
            icon={<Clock size={20} />}
            label="Hours Logged"
            value={hoursLogged}
            sub="total"
            color="#06b6d4"
          />
          <StatCard
            icon={<Zap size={20} />}
            label="XP Earned"
            value={progress?.xp || 0}
            sub={`Lv.${xpInfo.level} ${xpInfo.name}`}
            color="#a855f7"
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            label="Days Remaining"
            value={Math.max(0, total - completed)}
            sub="to complete"
            color="#ef4444"
          />
        </div>

        {/* Roadmap Progress */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Progress Card */}
          <div className="glass" style={{ padding: 28, gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Roadmap Progress</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {roadmap.title}
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#22c55e' }}>{completion}%</div>
            </div>
            <div className="progress-track" style={{ height: 8, marginBottom: 12 }}>
              <div className="progress-fill" style={{ width: `${completion}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569' }}>
              <span>Day {currentDay} of {total}</span>
              <span>{total - completed} days remaining</span>
            </div>
            <button onClick={() => navigate('/roadmap')} className="btn-ghost" style={{ marginTop: 16, fontSize: '0.8rem', padding: '8px 16px' }}>
              View Full Roadmap <ArrowRight size={14} />
            </button>
          </div>

          {/* Level Card */}
          <div className="glass" style={{ padding: 28 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Your Level</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #a855f7, #4f8ef7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', fontWeight: 900, color: 'white',
              }}>{xpInfo.level}</div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{xpInfo.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>{progress?.xp || 0} XP total</div>
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: 6 }}>Progress to Level {xpInfo.level + 1}</div>
            <div className="xp-bar" style={{ height: 6 }}>
              <div className="xp-fill" style={{ width: `${xpInfo.progress}%` }} />
            </div>
            <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: 6 }}>{Math.round(xpInfo.progress)}% complete</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-subtitle">Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
            {[
              { icon: <Zap size={18} />, label: "Today's Mission", path: '/today', color: '#4f8ef7' },
              { icon: <Map size={18} />, label: 'View Roadmap', path: '/roadmap', color: '#22c55e' },
              { icon: <BookOpen size={18} />, label: 'Write Journal', path: '/journal', color: '#06b6d4' },
              { icon: <Bot size={18} />, label: 'Ask AI Coach', path: '/coach', color: '#a855f7' },
              { icon: <Activity size={18} />, label: 'Analytics', path: '/analytics', color: '#f59e0b' },
              { icon: <Trophy size={18} />, label: 'Achievements', path: '/achievements', color: '#ef4444' },
            ].map(({ icon, label, path, color }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid rgba(255,255,255,0.07)`,
                  borderRadius: 14, padding: '16px 14px',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  color,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.borderColor = `${color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
              >
                {icon}
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', textAlign: 'center' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Days */}
        {roadmap?.parsedDays?.length > 0 && (
          <div className="glass" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Recent Progress</span>
              <button onClick={() => navigate('/roadmap')} style={{ background: 'none', border: 'none', color: '#4f8ef7', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ArrowRight size={13} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {roadmap.parsedDays.slice(0, 6).map((day, idx) => {
                const dayNum = day.day;
                const isCompleted = progress?.completedDays?.includes(dayNum);
                const isCurrent = dayNum === currentDay;
                return (
                  <div key={dayNum} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10,
                    background: isCurrent ? 'rgba(79,142,247,0.07)' : 'transparent',
                    border: `1px solid ${isCurrent ? 'rgba(79,142,247,0.2)' : 'transparent'}`,
                  }}>
                    {isCompleted && <CheckCircle2 size={16} color="#22c55e" />}
                    {isCurrent && <Zap size={16} color="#4f8ef7" />}
                    {!isCompleted && !isCurrent && <Lock size={14} color="#475569" />}
                    <span style={{ fontSize: '0.75rem', color: '#475569', minWidth: 44 }}>Day {dayNum}</span>
                    <span style={{ fontSize: '0.875rem', color: isCompleted ? '#94a3b8' : isCurrent ? '#f1f5f9' : '#475569', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {day.topic}
                    </span>
                    {isCurrent && <span className="badge-current" style={{ fontSize: '0.65rem' }}>Now</span>}
                    {isCompleted && <span className="badge-completed" style={{ fontSize: '0.65rem' }}>Done</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
