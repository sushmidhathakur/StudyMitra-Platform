import React from 'react';
import AppLayout from '../components/AppLayout';
import { Shield, Users, Map, Activity } from 'lucide-react';

export default function Admin() {
  // In a real app, you would check if userProfile.role === 'admin'
  // and redirect if not. For now, this is a mockup UI.

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div style={{ marginBottom: 40 }}>
          <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Shield size={28} color="#ef4444" />
            Admin Dashboard
          </h1>
          <p className="section-subtitle">System overview and platform management.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 40 }}>
          {[
            { label: 'Total Users', value: '1,248', icon: <Users size={24} color="#4f8ef7" /> },
            { label: 'Active Roadmaps', value: '892', icon: <Map size={24} color="#22c55e" /> },
            { label: 'System Health', value: '99.9%', icon: <Activity size={24} color="#a855f7" /> },
          ].map(stat => (
            <div key={stat.label} className="glass" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass" style={{ padding: 32 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Recent Platform Activity</h3>
          <div style={{ color: '#64748b' }}>
            Analytics and management tables would go here. Only accessible to administrators.
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
