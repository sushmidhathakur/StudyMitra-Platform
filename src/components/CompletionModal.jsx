import React, { useState } from 'react';
import { useRoadmap } from '../contexts/RoadmapContext';
import { X, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CompletionModal({ isOpen = false, dayIndex, topic, estimatedMinutes, onClose, onSuccess, day, xpEarned }) {
  const { completeDay } = useRoadmap();
  const [summary, setSummary] = useState('');
  const [minutes, setMinutes] = useState(estimatedMinutes || 90);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [xpGain, setXpGain] = useState(xpEarned || 0);
  const [newStreak, setNewStreak] = useState(0);

  // Support both old and new prop names for backward compatibility
  const actualDayIndex = dayIndex !== undefined ? dayIndex : day;
  const actualTopic = topic || 'Daily Mission';

  const minChars = 10;
  const isValid = summary.trim().length >= minChars;

  // Handle modal visibility
  if (!isOpen && dayIndex === undefined && day === undefined) {
    return null;
  }

  async function handleSubmit() {
    if (!isValid) return;
    setLoading(true);
    try {
      const result = await completeDay(actualDayIndex + 1, summary.trim(), Number(minutes));
      setXpGain(result?.xpGain || 100);
      setNewStreak(result?.newStreak || 1);
      setSuccess(true);
      toast.success('Day completed! 🎉 Keep it up!');
      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 2500);
    } catch (err) {
      toast.error('Failed to save. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose?.()} style={{ display: isOpen ? 'flex' : 'none' }}>
      <div className="modal-box animate-slide-up">
        {success ? (
          /* Success State */
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e', marginBottom: 8 }}>
              Day {dayIndex} Complete!
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: 20 }}>Amazing work! You're making real progress.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <div style={{
                background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.3)',
                borderRadius: 12, padding: '12px 20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4f8ef7' }}>+{xpGain}</div>
                <div style={{ fontSize: '0.7rem', color: '#475569' }}>XP Earned</div>
              </div>
              <div style={{
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 12, padding: '12px 20px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>🔥 {newStreak}</div>
                <div style={{ fontSize: '0.7rem', color: '#475569' }}>Day Streak</div>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: 20 }}>Unlocking next day…</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Sparkles size={18} color="#4f8ef7" />
                  <span style={{ fontSize: '0.75rem', color: '#4f8ef7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Complete Day {actualDayIndex + 1}</span>
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f1f5f9' }}>{actualTopic}</h2>
              </div>
              <button onClick={() => onClose?.()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* What did you learn */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
                What did you learn today? *
              </label>
              <textarea
                className="input-glass"
                placeholder={`Describe what you learned about "${topic}" today. Be specific — minimum ${minChars} characters...`}
                value={summary}
                onChange={e => setSummary(e.target.value)}
                rows={5}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: '0.72rem', color: summary.length < minChars ? '#ef4444' : '#22c55e' }}>
                  {summary.length < minChars
                    ? `${minChars - summary.length} more characters needed`
                    : '✓ Good summary!'
                  }
                </span>
                <span style={{ fontSize: '0.72rem', color: '#475569' }}>{summary.length} chars</span>
              </div>
            </div>

            {/* Time spent */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
                Time spent (minutes)
              </label>
              <input
                type="number"
                className="input-glass"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                min={1} max={480}
                style={{ maxWidth: 160 }}
              />
            </div>

            {/* XP Preview */}
            <div style={{
              background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.2)',
              borderRadius: 12, padding: '12px 16px', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Zap size={16} color="#4f8ef7" />
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                You'll earn <strong style={{ color: '#4f8ef7' }}>+{summary.length >= 200 ? 130 : 100} XP</strong> for completing this day
                {summary.length >= 200 && <span style={{ color: '#22c55e' }}> + bonus for detailed summary!</span>}
              </span>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!isValid || loading}
              className="btn-green"
              style={{ width: '100%', justifyContent: 'center', opacity: (!isValid || loading) ? 0.5 : 1 }}
            >
              <CheckCircle2 size={18} />
              {loading ? 'Saving...' : 'Mark Day Complete & Unlock Next'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
