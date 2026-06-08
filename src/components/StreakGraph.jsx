import React, { useMemo } from 'react';
import { getLast52Weeks, getMonthLabel } from '../utils/dateHelpers';

export default function StreakGraph({ history = {} }) {
  const weeks = useMemo(() => getLast52Weeks(), []);

  const months = useMemo(() => {
    const labels = [];
    let prevMonth = '';
    weeks.forEach((week, wIdx) => {
      const month = getMonthLabel(week[0]);
      if (month !== prevMonth) {
        labels.push({ month, weekIndex: wIdx });
        prevMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={{ overflowX: 'auto' }}>
      {/* Month labels */}
      <div style={{ display: 'flex', marginLeft: 36, marginBottom: 4, position: 'relative', height: 16 }}>
        {months.map(({ month, weekIndex }) => (
          <div key={month + weekIndex} style={{
            position: 'absolute',
            left: weekIndex * 16,
            fontSize: '0.65rem',
            color: '#475569',
            whiteSpace: 'nowrap',
          }}>{month}</div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginRight: 4 }}>
          {days.map((d, i) => (
            <div key={d} style={{
              height: 12, fontSize: '0.6rem', color: '#475569',
              display: i % 2 === 1 ? 'flex' : 'none',
              alignItems: 'center', lineHeight: 1,
            }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'flex', gap: 3 }}>
          {weeks.map((week, wIdx) => (
            <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {week.map((date) => {
                const today = new Date().toISOString().split('T')[0];
                const isFuture = date > today;
                const isActive = history[date];
                return (
                  <div
                    key={date}
                    className={`heatmap-cell ${isActive ? 'level-4' : ''}`}
                    style={{ opacity: isFuture ? 0.2 : 1 }}
                    title={date + (isActive ? ' ✓' : '')}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
        <span style={{ fontSize: '0.7rem', color: '#475569' }}>Less</span>
        {[0, 1, 2, 3, 4].map(l => (
          <div key={l} className={`heatmap-cell ${l > 0 ? `level-${l}` : ''}`} />
        ))}
        <span style={{ fontSize: '0.7rem', color: '#475569' }}>More</span>
      </div>
    </div>
  );
}
