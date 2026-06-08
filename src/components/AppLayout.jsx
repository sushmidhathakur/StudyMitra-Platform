import React from 'react';
import Sidebar from '../components/Sidebar';

export default function AppLayout({ children, title }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#05070f' }}>
      {/* Sidebar */}
      <div style={{ width: 260, flexShrink: 0 }} className="sidebar-desktop">
        <Sidebar />
      </div>
      {/* Mobile sidebar (overlay) */}
      <div className="mobile-sidebar-wrapper">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main style={{
        flex: 1,
        minHeight: '100vh',
        overflowY: 'auto',
        position: 'relative',
      }}>
        {/* Ambient orbs */}
        <div style={{
          position: 'fixed', top: -200, right: -200,
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,142,247,0.07) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{
          position: 'fixed', bottom: -150, left: 100,
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '32px 32px', maxWidth: 1200 }}>
          {children}
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          main > div { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
}
