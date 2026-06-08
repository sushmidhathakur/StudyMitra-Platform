import React, { useEffect, useState } from 'react';
import { useRoadmap } from '../contexts/RoadmapContext';
import { useAuth } from '../contexts/AuthContext';
import AppLayout from '../components/AppLayout';
import { Activity, TrendingUp, Zap, Clock } from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function Analytics() {
  const { roadmap, progress } = useRoadmap();
  const { user } = useAuth();
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJournalData() {
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
        const data = snapshot.docs.map(doc => doc.data()).reverse();
        setJournalEntries(data);
      } catch (err) {
        console.error('Error fetching journal data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchJournalData();
  }, [user?.uid]);

  if (!roadmap || !progress) {
    return (
      <AppLayout>
        <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '10vh' }}>
          <Activity size={48} color="#475569" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>No Data Yet</h2>
          <p style={{ color: '#64748b' }}>Complete some days to see your analytics.</p>
        </div>
      </AppLayout>
    );
  }

  // Generate real data from journal entries (last 7 days)
  const last7Days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    last7Days.push({ dateStr, dayName });
  }

  // Map journal entries to last 7 days
  const velocityData = last7Days.map(day => {
    const entry = journalEntries.find(e => e.date === day.dateStr);
    return entry?.minutesSpent || 0;
  });

  // Calculate streak data for last 7 days
  const streakData = last7Days.map((_, idx) => {
    const daysCompleted = journalEntries.slice(0, idx + 1).length;
    return Math.min(daysCompleted, 7);
  });

  const chartData = {
    labels: last7Days.map(d => d.dayName),
    velocityData,
    streakData,
  };

  const velocityChartData = {
    labels: chartData.labels,
    datasets: [{
      label: 'Minutes Studied',
      data: chartData.velocityData,
      borderColor: '#4f8ef7',
      backgroundColor: 'rgba(79,142,247,0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 5,
      pointBackgroundColor: '#4f8ef7',
      pointBorderColor: '#fff',
    }],
  };

  const streakChartData = {
    labels: chartData.labels,
    datasets: [{
      label: 'Days in Streak',
      data: chartData.streakData,
      backgroundColor: '#f59e0b',
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
      x: { grid: { display: false }, ticks: { color: '#64748b' } }
    }
  };

  const totalCompleted = progress.completedDays?.length || 0;
  const avgMinutes = totalCompleted ? Math.round((progress.totalMinutes || 0) / totalCompleted) : 0;
  const totalHours = Math.round((progress.totalMinutes || 0) / 60 * 10) / 10;
  const last7DaysTotal = chartData.velocityData.reduce((a, b) => a + b, 0);

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div style={{ marginBottom: 40 }}>
          <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Activity size={28} color="#f59e0b" />
            Analytics Dashboard
          </h1>
          <p className="section-subtitle">Insights into your learning habits and velocity.</p>
        </div>

        {/* Top metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
          <div className="glass" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(79,142,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={24} color="#4f8ef7" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Velocity (Avg)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{avgMinutes} <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>m/day</span></div>
            </div>
          </div>
          <div className="glass" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={24} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Best Streak</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{progress.longestStreak || 0} <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>days</span></div>
            </div>
          </div>
          <div className="glass" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} color="#22c55e" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Hours</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{totalHours}</div>
            </div>
          </div>
          <div className="glass" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(168,85,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={24} color="#a855f7" />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Last 7 Days</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{last7DaysTotal} <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>mins</span></div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div className="glass" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, color: '#f1f5f9' }}>Study Velocity (Past 7 Days)</h3>
            <div style={{ height: 280 }}>
              <Line data={velocityChartData} options={options} />
            </div>
          </div>
          
          <div className="glass" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, color: '#f1f5f9' }}>Streak History</h3>
            <div style={{ height: 280 }}>
              <Bar data={streakChartData} options={options} />
            </div>
          </div>
        </div>

        {/* Learning Summary */}
        {journalEntries.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, color: '#f1f5f9' }}>Recent Learning Sessions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
              {journalEntries.slice(0, 6).map((entry, idx) => (
                <div key={idx} className="glass" style={{ padding: 16 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4f8ef7', marginBottom: 8 }}>
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f1f5f9', marginBottom: 8 }}>
                    {entry.topic}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 8 }}>
                    {entry.minutesSpent || 0} mins • +{entry.xpEarned || 0} XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        <div style={{ marginTop: 24, fontSize: '0.8rem', color: '#475569', textAlign: 'center' }}>
          * Data is pulled from your journal entries and learning history in real-time.
        </div>
      </div>
    </AppLayout>
  );
}
