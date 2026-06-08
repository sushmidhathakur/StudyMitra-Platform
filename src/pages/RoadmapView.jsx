import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoadmap } from '../contexts/RoadmapContext';
import AppLayout from '../components/AppLayout';
import { CheckCircle2, Lock, Zap, Map as MapIcon, ArrowRight, FileText, Star } from 'lucide-react';

export default function RoadmapView() {
  const { roadmap, progress, loading } = useRoadmap();
  const navigate = useNavigate();

  if (loading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ color: '#475569' }}>Loading roadmap...</div>
        </div>
      </AppLayout>
    );
  }

  if (!roadmap) {
    return (
      <AppLayout>
        <div className="animate-fade-in" style={{ textAlign: 'center', marginTop: '10vh' }}>
          <MapIcon size={64} color="#475569" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>No Roadmap Found</h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>You haven't uploaded a roadmap yet. Let's get started!</p>
          <button onClick={() => navigate('/upload')} className="btn-primary" style={{ padding: '12px 24px' }}>
            Upload Roadmap
          </button>
        </div>
      </AppLayout>
    );
  }

  const currentDay = progress?.currentDay || 1;
  const completedDays = progress?.completedDays || [];
  const days = roadmap.parsedDays || [];
  const total = roadmap.totalDays || days.length;
  const completion = total ? Math.round((completedDays.length / total) * 100) : 0;

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <MapIcon size={28} color="#4f8ef7" />
              {roadmap.title}
            </h1>
            <p className="section-subtitle">
              Your guided journey. Day by day, step by step.
            </p>
          </div>
          <div className="glass" style={{ padding: '16px 24px', display: 'flex', gap: 32, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Completion</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#22c55e' }}>{completion}%</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>Current Day</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4f8ef7' }}>{currentDay} / {total}</div>
            </div>
            {currentDay <= total && (
              <button onClick={() => navigate('/today')} className="btn-primary" style={{ fontSize: '0.85rem', padding: '10px 16px' }}>
                <Zap size={14} /> Today's Mission
              </button>
            )}
          </div>
        </div>

        {/* Roadmap Path */}
        <div style={{ position: 'relative', paddingLeft: 20, marginBottom: 60 }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', top: 20, bottom: 20, left: 34, width: 2,
            background: 'rgba(255,255,255,0.05)', zIndex: 0,
          }} />

          {days.map((day, idx) => {
            const dayNum = day.day;
            const isCompleted = completedDays.includes(dayNum);
            const isCurrent = dayNum === currentDay;
            const isLocked = dayNum > currentDay;

            let statusColor = '#475569';
            let bgClass = 'glass';
            let StatusIcon = Lock;
            
            if (isCompleted) {
              statusColor = '#22c55e';
              StatusIcon = CheckCircle2;
            } else if (isCurrent) {
              statusColor = '#4f8ef7';
              bgClass = 'glass-strong';
              StatusIcon = Zap;
            }

            return (
              <div key={dayNum} style={{
                display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20, position: 'relative', zIndex: 1,
              }}>
                {/* Node */}
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: isCurrent ? 'rgba(79,142,247,0.2)' : isCompleted ? 'rgba(34,197,94,0.1)' : '#05070f',
                  border: `2px solid ${isCurrent ? '#4f8ef7' : isCompleted ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <StatusIcon size={14} color={statusColor} />
                </div>

                {/* Card */}
                <div className={bgClass} style={{
                  flex: 1, padding: '16px 20px', 
                  display: 'flex', alignItems: 'center', gap: 16,
                  opacity: isLocked ? 0.6 : 1,
                  borderLeft: isCurrent ? '3px solid #4f8ef7' : undefined,
                  transition: 'all 0.2s',
                  cursor: isCurrent ? 'pointer' : 'default',
                }}
                onClick={() => isCurrent ? navigate('/today') : null}
                >
                  <div style={{ minWidth: 60 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: statusColor, textTransform: 'uppercase' }}>Day {dayNum}</div>
                    {day.milestone && <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem', color: '#f59e0b', marginTop: 4 }}><Star size={10} /> Milestone</div>}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: isCurrent ? '#f1f5f9' : isCompleted ? '#94a3b8' : '#64748b', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                      {day.topic}
                    </div>
                  </div>

                  {day.estimatedMinutes && (
                    <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={12} /> {day.estimatedMinutes}m
                    </div>
                  )}

                  {isCurrent && <ArrowRight size={18} color="#4f8ef7" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
