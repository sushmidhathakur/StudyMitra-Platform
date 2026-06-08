import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoadmap } from '../contexts/RoadmapContext';
import AppLayout from '../components/AppLayout';
import CompletionModal from '../components/CompletionModal';
import { todayStr } from '../utils/dateHelpers';
import { Zap, CheckCircle2, Clock, BookOpen, PenTool, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TodayMission() {
  const { roadmap, progress, completeDay, loading } = useRoadmap();
  const navigate = useNavigate();

  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (loading) return <AppLayout>Loading...</AppLayout>;

  if (!roadmap) {
    return (
      <AppLayout>
        <div style={{ textAlign: 'center', marginTop: '10vh' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>No Roadmap Active</h2>
          <button onClick={() => navigate('/upload')} className="btn-primary">Upload Roadmap</button>
        </div>
      </AppLayout>
    );
  }

  const currentDay = progress?.currentDay || 1;
  const isDoneToday = todayStr() === progress?.lastCompletedDate;
  const topic = roadmap.parsedDays?.[currentDay - 1];

  if (!topic) {
    return (
      <AppLayout>
        <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e', marginBottom: 16 }}>Roadmap Complete! 🎉</h2>
          <p style={{ color: '#94a3b8' }}>You have completed all days in this roadmap.</p>
        </div>
      </AppLayout>
    );
  }

  const handleComplete = async () => {
    if (summary.trim().length < 10) {
      toast.error('Please write a brief summary (min 10 chars) of what you learned.');
      return;
    }

    setSubmitting(true);
    try {
      await completeDay(currentDay, summary, topic.estimatedMinutes || 90);
      setShowModal(true);
    } catch (err) {
      toast.error('Failed to complete day: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ padding: '6px 12px', background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.3)', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, color: '#4f8ef7', textTransform: 'uppercase' }}>
              Day {currentDay} Mission
            </span>
            {isDoneToday && (
              <span style={{ padding: '6px 12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase' }}>
                Completed
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 16, color: '#f1f5f9' }}>
            {topic.topic}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={16} /> ~{topic.estimatedMinutes || 90} min expected</span>
            {topic.milestone && <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b' }}>⭐ Milestone Topic</span>}
          </p>
        </div>

        {isDoneToday ? (
          <div className="glass-strong" style={{ padding: 40, textAlign: 'center', borderRadius: 24, border: '1px solid rgba(34,197,94,0.3)', background: 'linear-gradient(135deg, rgba(34,197,94,0.1), transparent)' }}>
            <CheckCircle2 size={64} color="#22c55e" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>Mission Accomplished</h2>
            <p style={{ color: '#94a3b8', marginBottom: 24 }}>You've finished your mission for today. Take a break, and come back tomorrow to unlock Day {currentDay}.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => navigate('/dashboard')} className="btn-ghost">Back to Dashboard</button>
              <button onClick={() => navigate('/journal')} className="btn-primary">View Journal</button>
            </div>
          </div>
        ) : (
          <div className="glass" style={{ padding: 32, borderRadius: 24 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={20} color="#4f8ef7" /> Log Your Learning
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: 20 }}>
              To complete today's mission, write a short summary of what you learned. This acts as your proof-of-work and gets saved to your journal.
            </p>
            
            <textarea
              className="input-glass"
              style={{ minHeight: 160, resize: 'vertical', marginBottom: 24, fontSize: '0.95rem' }}
              placeholder="I learned about... I struggled with... I built..."
              value={summary}
              onChange={e => setSummary(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleComplete}
                disabled={submitting || summary.trim().length < 10}
                className="btn-primary"
                style={{ fontSize: '1rem', padding: '12px 32px' }}
              >
                {submitting ? 'Submitting...' : <><Zap size={18} /> Complete Mission & Claim XP</>}
              </button>
            </div>
          </div>
        )}

        {/* Future Days Preview */}
        {!isDoneToday && currentDay < roadmap.totalDays && (
          <div style={{ marginTop: 40 }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 16 }}>Coming Up Next</h4>
            <div className="glass" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, opacity: 0.6 }}>
              <Lock size={20} color="#475569" />
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Day {currentDay + 1}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#94a3b8' }}>{roadmap.parsedDays[currentDay]?.topic}</div>
              </div>
            </div>
          </div>
        )}

        <CompletionModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); navigate('/dashboard'); }}
          day={currentDay - 1} // since we advanced it already in context, or rather it will advance, just pass currentDay conceptually
          xpEarned={50}
        />
      </div>
    </AppLayout>
  );
}
