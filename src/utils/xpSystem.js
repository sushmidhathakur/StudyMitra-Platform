// XP & Level System

export const XP_REWARDS = {
  DAY_COMPLETE: 100,
  STREAK_3: 50,
  STREAK_7: 150,
  STREAK_30: 500,
  ROADMAP_COMPLETE: 1000,
  JOURNAL_ENTRY: 25,
  LONG_SUMMARY: 30, // bonus for detailed summary
};

export const LEVELS = [
  { level: 1, name: 'Beginner', minXP: 0, maxXP: 200 },
  { level: 2, name: 'Explorer', minXP: 200, maxXP: 500 },
  { level: 3, name: 'Learner', minXP: 500, maxXP: 1000 },
  { level: 4, name: 'Practitioner', minXP: 1000, maxXP: 2000 },
  { level: 5, name: 'Scholar', minXP: 2000, maxXP: 3500 },
  { level: 6, name: 'Expert', minXP: 3500, maxXP: 5500 },
  { level: 7, name: 'Master', minXP: 5500, maxXP: 8000 },
  { level: 8, name: 'Sage', minXP: 8000, maxXP: 12000 },
  { level: 9, name: 'Legend', minXP: 12000, maxXP: 18000 },
  { level: 10, name: 'Grandmaster', minXP: 18000, maxXP: Infinity },
];

export function getLevelInfo(xp) {
  const level = LEVELS.find(l => xp >= l.minXP && xp < l.maxXP) || LEVELS[LEVELS.length - 1];
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1];
  const progress = nextLevel
    ? ((xp - level.minXP) / (nextLevel.minXP - level.minXP)) * 100
    : 100;
  return { ...level, progress: Math.min(progress, 100), currentXP: xp };
}

export function calculateXP(completedDays, streak, journalEntries) {
  let xp = completedDays * XP_REWARDS.DAY_COMPLETE;
  xp += journalEntries * XP_REWARDS.JOURNAL_ENTRY;
  if (streak >= 3) xp += XP_REWARDS.STREAK_3;
  if (streak >= 7) xp += XP_REWARDS.STREAK_7;
  if (streak >= 30) xp += XP_REWARDS.STREAK_30;
  return xp;
}

export const BADGES = [
  { id: 'first_day', name: 'First Steps', desc: 'Complete your first day.', icon: '👶', condition: (p) => p.completedDays?.length >= 1 },
  { id: 'streak_3', name: 'On Fire', desc: 'Hit a 3-day streak.', icon: '🔥', condition: (p) => p.longestStreak >= 3 },
  { id: 'streak_7', name: 'Unstoppable', desc: 'Hit a 7-day streak.', icon: '⚡', condition: (p) => p.longestStreak >= 7 },
  { id: 'streak_30', name: 'Consistency God', desc: 'Hit a 30-day streak.', icon: '👑', condition: (p) => p.longestStreak >= 30 },
  { id: 'hours_10', name: 'Dedicated', desc: 'Log 10 hours of learning.', icon: '⏱️', condition: (p) => (p.totalMinutes || 0) >= 600 },
  { id: 'roadmap_1', name: 'Journey Complete', desc: 'Complete a full roadmap.', icon: '🏆', condition: (p) => p.completedDays?.length > 0 && false }, // Would need roadmap totalDays to fully evaluate
];
