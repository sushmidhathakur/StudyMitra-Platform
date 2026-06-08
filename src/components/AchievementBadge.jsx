import React from 'react';

const ACHIEVEMENTS_DEF = [
  { id: 'first_day', icon: '🌱', name: 'First Step', desc: 'Complete your first day', color: '#22c55e' },
  { id: 'streak_3', icon: '🔥', name: '3-Day Streak', desc: 'Learn 3 days in a row', color: '#f59e0b' },
  { id: 'streak_7', icon: '⚡', name: 'Week Warrior', desc: 'Learn 7 days in a row', color: '#4f8ef7' },
  { id: 'streak_30', icon: '💎', name: 'Consistency Master', desc: '30-day streak', color: '#a855f7' },
  { id: 'days_10', icon: '🎯', name: '10 Days Done', desc: 'Complete 10 days', color: '#06b6d4' },
  { id: 'days_30', icon: '🏆', name: '30 Days Done', desc: 'Complete 30 days', color: '#f59e0b' },
  { id: 'hours_10', icon: '⏱️', name: '10 Hours Logged', desc: 'Log 10 hours of learning', color: '#22c55e' },
  { id: 'hours_100', icon: '🚀', name: '100 Hours Logged', desc: 'Log 100 hours of learning', color: '#ef4444' },
  { id: 'roadmap_complete', icon: '🎓', name: 'Roadmap Completed!', desc: 'Finish the entire roadmap', color: '#f59e0b' },
];

export function getAllAchievementDefs() {
  return ACHIEVEMENTS_DEF;
}

export default function AchievementBadge({ achievement, earned = false }) {
  const def = ACHIEVEMENTS_DEF.find(a => a.id === achievement?.id) || {
    icon: '🏅', name: achievement?.name || 'Achievement', desc: '', color: '#4f8ef7',
  };

  return (
    <div className={`achievement-badge ${earned ? 'earned' : ''}`}>
      <div style={{
        fontSize: '2.5rem', marginBottom: 10,
        filter: earned ? 'none' : 'grayscale(100%) opacity(0.3)',
      }}>{def.icon}</div>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: earned ? def.color : '#475569' }}>
        {def.name}
      </div>
      <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: 4 }}>{def.desc}</div>
      {earned && achievement?.earnedAt && (
        <div style={{ fontSize: '0.65rem', color: '#4f8ef7', marginTop: 8 }}>
          ✓ Earned
        </div>
      )}
    </div>
  );
}
