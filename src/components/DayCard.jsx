import React from 'react';
import { CheckCircle2, Lock, Flame, Star } from 'lucide-react';

export default function DayCard({ day, topic, status, estimatedMinutes, milestone, onClick }) {
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  const isLocked = status === 'locked';

  return (
    <div
      onClick={isCurrent ? onClick : undefined}
      className={`glass day-card-${status}`}
      style={{
        padding: '16px 20px',
        cursor: isCurrent ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        transition: 'all 0.3s ease',
        transform: isCurrent ? 'scale(1.01)' : 'scale(1)',
      }}
    >
      {/* Status Icon */}
      <div style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isCompleted ? 'rgba(34,197,94,0.15)' : isCurrent ? 'rgba(79,142,247,0.15)' : 'rgba(255,255,255,0.04)',
        border: isCompleted ? '2px solid #22c55e' : isCurrent ? '2px solid #4f8ef7' : '2px solid rgba(255,255,255,0.08)',
      }}>
        {isCompleted && <CheckCircle2 size={18} color="#22c55e" />}
        {isCurrent && <Flame size={18} color="#4f8ef7" />}
        {isLocked && <Lock size={16} color="#475569" />}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600 }}>DAY {day}</span>
          {milestone && <Star size={11} color="#f59e0b" fill="#f59e0b" />}
        </div>
        <div style={{
          fontSize: '0.9rem', fontWeight: 600, color: isLocked ? '#475569' : '#f1f5f9',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          marginTop: 2,
        }}>{topic}</div>
        {estimatedMinutes && !isLocked && (
          <div style={{ fontSize: '0.72rem', color: '#4f8ef7', marginTop: 3 }}>
            ~{estimatedMinutes} min
          </div>
        )}
      </div>

      {/* Badge */}
      <div>
        {isCompleted && <span className="badge-completed">✓ Done</span>}
        {isCurrent && <span className="badge-current">▶ Active</span>}
        {isLocked && <span className="badge-locked">🔒</span>}
      </div>
    </div>
  );
}
