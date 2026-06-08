import React from 'react';

export default function LoadingSpinner({ fullScreen = false, size = 40 }) {
  const spinner = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: size,
        height: size,
        border: `3px solid rgba(79,142,247,0.2)`,
        borderTop: `3px solid #4f8ef7`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ color: '#64748b', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
        Loading...
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: '#05070f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 20,
      }}>
        <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}>
          <span style={{ background: 'linear-gradient(135deg, #4f8ef7, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            StudyMitra
          </span>
        </div>
        {spinner}
      </div>
    );
  }

  return spinner;
}
