// Date helpers

export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getDayOfWeek(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'long' });
}

export function daysBetween(date1Str, date2Str) {
  const d1 = new Date(date1Str);
  const d2 = new Date(date2Str);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function getLast52Weeks() {
  const weeks = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 363); // ~52 weeks

  let current = new Date(start);
  // Start from Sunday
  current.setDate(current.getDate() - current.getDay());

  while (current <= today) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export function getMonthLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { month: 'short' });
}
