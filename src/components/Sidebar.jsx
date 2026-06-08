import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRoadmap } from '../contexts/RoadmapContext';
import { getLevelInfo } from '../utils/xpSystem';
import {
  LayoutDashboard, Map, BookOpen, BarChart2, Bot,
  Trophy, User, Upload, LogOut, Menu, X, Flame,
  ChevronRight, Zap, Settings,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/today', icon: Zap, label: "Today's Mission" },
  { path: '/roadmap', icon: Map, label: 'Roadmap' },
  { path: '/journal', icon: BookOpen, label: 'Journal' },
  { path: '/analytics', icon: BarChart2, label: 'Analytics' },
  { path: '/coach', icon: Bot, label: 'AI Coach' },
  { path: '/achievements', icon: Trophy, label: 'Achievements' },
];

export default function Sidebar() {
  const { user, userProfile, logout } = useAuth();
  const { progress, roadmap } = useRoadmap();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const xpInfo = getLevelInfo(progress?.xp || 0);
  const completion = roadmap
    ? Math.round(((progress?.completedDays?.length || 0) / roadmap.totalDays) * 100)
    : 0;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div style={{
      width: 260,
      height: '100vh',
      background: 'rgba(5,7,15,0.95)',
      backdropFilter: 'blur(30px)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      position: 'fixed',
      left: 0, top: 0,
      zIndex: 100,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, padding: '0 8px' }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #4f8ef7, #22c55e)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 900, color: 'white',
          }}>S</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f1f5f9' }}>StudyMitra</div>
            <div style={{ fontSize: '0.65rem', color: '#475569', letterSpacing: '0.05em' }}>LEARNING OS</div>
          </div>
        </div>
      </Link>

      {/* User Profile Card */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        padding: '14px',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="avatar" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f8ef7, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '1rem', color: 'white',
            }}>
              {(userProfile?.displayName || user?.displayName || 'U')[0].toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userProfile?.displayName || user?.displayName || 'Learner'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#4f8ef7' }}>Lv.{xpInfo.level} {xpInfo.name}</div>
          </div>
          {progress?.currentStreak > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>
              <Flame size={14} /> {progress.currentStreak}
            </div>
          )}
        </div>

        {/* XP Bar */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#475569', marginBottom: 4 }}>
            <span>{progress?.xp || 0} XP</span>
            <span>Lv.{xpInfo.level + 1}</span>
          </div>
          <div className="xp-bar"><div className="xp-fill" style={{ width: `${xpInfo.progress}%` }} /></div>
        </div>

        {/* Roadmap Progress */}
        {roadmap && (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#475569', marginBottom: 4 }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{roadmap.title}</span>
              <span style={{ color: '#22c55e' }}>{completion}%</span>
            </div>
            <div className="progress-track" style={{ height: 4 }}>
              <div className="progress-fill" style={{ width: `${completion}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1 }}>
        {navItems.map(({ path, icon: Icon, label }) => (
          <div
            key={path}
            onClick={() => { navigate(path); setMobileOpen(false); }}
            className={`sidebar-link ${location.pathname === path ? 'active' : ''}`}
            style={{ marginBottom: 4 }}
          >
            <Icon size={18} />
            <span>{label}</span>
            {location.pathname === path && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
          </div>
        ))}

        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '12px 0' }} />

        <div onClick={() => { navigate('/upload'); setMobileOpen(false); }}
          className={`sidebar-link ${location.pathname === '/upload' ? 'active' : ''}`}
          style={{ marginBottom: 4 }}>
          <Upload size={18} /><span>Upload Roadmap</span>
        </div>

        <div onClick={() => { navigate('/profile'); setMobileOpen(false); }}
          className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}
          style={{ marginBottom: 4 }}>
          <User size={18} /><span>Profile</span>
        </div>
      </nav>

      {/* Logout */}
      <div
        onClick={handleLogout}
        className="sidebar-link"
        style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
      >
        <LogOut size={18} /><span>Sign Out</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="sidebar-desktop">
        <SidebarContent />
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 200,
          background: 'rgba(5,7,15,0.9)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, padding: 10, cursor: 'pointer', color: '#f1f5f9',
          display: 'none',
        }}
        className="mobile-menu-btn"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150 }}>
          <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <SidebarContent />
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
