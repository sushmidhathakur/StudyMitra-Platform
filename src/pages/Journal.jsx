import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useRoadmap } from '../contexts/RoadmapContext';
import AppLayout from '../components/AppLayout';
import { BookOpen, Calendar, Clock, Map as MapIcon, Loader2 } from 'lucide-react';

export default function Journal() {
  const { user } = useAuth();
  const { roadmap } = useRoadmap();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJournal() {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'journals', user.uid, 'entries'),
          orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEntries(data);
      } catch (err) {
        console.error('Error fetching journal:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchJournal();
  }, [user?.uid]);

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
      <div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BookOpen size={28} color="#06b6d4" />
            Learning Journal
          </h1>
          <p className="section-subtitle">
            Your personal log of knowledge, reflections, and completed missions.
          </p>
        </div>

        {!roadmap ? (
          <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
            <MapIcon size={48} color="#475569" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#94a3b8' }}>Upload a roadmap to start generating journal entries.</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
            <BookOpen size={48} color="#475569" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#94a3b8' }}>You haven't completed any days yet. Complete today's mission to write your first entry!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {entries.map((entry, idx) => (
              <div key={entry.id || idx} className="glass" style={{ padding: 24, position: 'relative' }}>
                <div style={{
                  position: 'absolute', top: 24, right: 24,
                  fontSize: '0.75rem', fontWeight: 600, color: '#4f8ef7',
                  background: 'rgba(79,142,247,0.1)', padding: '4px 10px', borderRadius: 999,
                }}>
                  Day {entry.dayIndex + 1}
                </div>
                
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12, paddingRight: 60 }}>
                  {entry.topic || `Day ${entry.dayIndex + 1} Mission`}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.8rem', color: '#64748b', marginBottom: 20 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={14} /> {entry.minutesSpent || 0} mins logged</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4f8ef7' }}>+{entry.xpEarned || 0} XP</span>
                </div>

                <div style={{
                  background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16,
                  fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.6, whiteSpace: 'pre-wrap'
                }}>
                  {entry.summary}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
