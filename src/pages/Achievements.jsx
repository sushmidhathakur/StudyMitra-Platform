import React, { useEffect, useState } from 'react';
import { useRoadmap } from '../contexts/RoadmapContext';
import { useAuth } from '../contexts/AuthContext';
import AppLayout from '../components/AppLayout';
import { BADGES } from '../utils/xpSystem';
import { Trophy, Lock, Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Achievements() {
  const { progress } = useRoadmap();
  const { user } = useAuth();
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create a safe default object to avoid crashes if progress is null
  const safeProgress = progress || {
    xp: 0, currentStreak: 0, longestStreak: 0, completedDays: [], totalMinutes: 0
  };

  useEffect(() => {
    async function fetchAchievements() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const achRef = doc(db, 'achievements', user.uid);
        const snap = await getDoc(achRef);
        
        if (snap.exists() && snap.data().earned) {
          setEarnedAchievements(snap.data().earned);
        } else {
          setEarnedAchievements([]);
        }
      } catch (err) {
        console.error('Error fetching achievements:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, [user?.uid]);

  const unlockedBadges = BADGES.filter(b => b.condition(safeProgress));
  const lockedBadges = BADGES.filter(b => !b.condition(safeProgress));

  if (loading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <Loader2 className="animate-spin" size={32} color="#4f8ef7" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div style={{ marginBottom: 40 }}>
          <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Trophy size={28} color="#ef4444" />
            Achievements
          </h1>
          <p className="section-subtitle">Earn badges by staying consistent and logging hours.</p>
        </div>

        <div style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
          <div className="glass" style={{ padding: '16px 24px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Unlocked Badges</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f5f9' }}>{unlockedBadges.length} <span style={{ fontSize: '1rem', color: '#475569' }}>/ {BADGES.length}</span></span>
          </div>
          <div className="glass" style={{ padding: '16px 24px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Total XP</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7' }}>{safeProgress.xp}</span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#f1f5f9' }}>Unlocked</h3>
        {unlockedBadges.length === 0 ? (
          <p style={{ color: '#64748b', marginBottom: 40 }}>No badges unlocked yet. Keep studying!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20, marginBottom: 40 }}>
            {unlockedBadges.map(badge => (
              <div key={badge.id} className="glass" style={{
                padding: 24, textAlign: 'center',
                border: '1px solid rgba(239,68,68,0.2)',
                background: 'linear-gradient(135deg, rgba(239,68,68,0.05), transparent)',
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{badge.icon}</div>
                <h4 style={{ fontWeight: 700, marginBottom: 8, color: '#f1f5f9' }}>{badge.name}</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{badge.desc}</p>
              </div>
            ))}
          </div>
        )}

        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, color: '#f1f5f9' }}>Locked</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
          {lockedBadges.map(badge => (
            <div key={badge.id} className="glass" style={{
              padding: 24, textAlign: 'center', opacity: 0.5,
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <Lock size={16} color="#475569" />
              </div>
              <div style={{ fontSize: 48, marginBottom: 12, filter: 'grayscale(100%)' }}>{badge.icon}</div>
              <h4 style={{ fontWeight: 700, marginBottom: 8, color: '#94a3b8' }}>{badge.name}</h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
