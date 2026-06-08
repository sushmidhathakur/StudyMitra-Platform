import React from 'react';

export default function StatCard({ icon, label, value, sub, color = '#4f8ef7', gradient }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: gradient || `${color}20`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
        }}>
          {icon}
        </div>
        {sub && (
          <span style={{
            fontSize: '0.7rem', padding: '3px 8px',
            background: `${color}15`, color,
            borderRadius: 999, border: `1px solid ${color}30`,
            fontWeight: 600,
          }}>{sub}</span>
        )}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>{label}</div>
    </div>
  );
}
