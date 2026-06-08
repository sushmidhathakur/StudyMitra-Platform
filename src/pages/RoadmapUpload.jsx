import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoadmap } from '../contexts/RoadmapContext';
import AppLayout from '../components/AppLayout';
import { parseRoadmapFile } from '../utils/roadmapParser';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Eye, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ACCEPTED = '.pdf,.xlsx,.xls,.csv,.txt,.md,.docx,.json';

export default function RoadmapUpload() {
  const { saveRoadmap, roadmap } = useRoadmap();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [parsed, setParsed] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  const handleFile = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setError('');
    setParsed(null);
    setParsing(true);

    // Auto set title from filename
    const name = selectedFile.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    setTitle(prev => prev || name);

    try {
      const days = await parseRoadmapFile(selectedFile);
      setParsed(days);
      toast.success(`✅ Parsed ${days.length} topics from your roadmap!`);
    } catch (err) {
      setError(err.message || 'Failed to parse file. Please check the format.');
      toast.error('Parse failed. Try a different format.');
    } finally {
      setParsing(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleSave = async () => {
    if (!parsed || !title.trim()) return;
    setSaving(true);
    try {
      await saveRoadmap(parsed, title.trim(), file.name);
      toast.success('🚀 Roadmap saved! Your journey begins now!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to save roadmap. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div style={{ marginBottom: 32 }}>
          <h1 className="section-title">Upload Your Roadmap</h1>
          <p className="section-subtitle">
            Upload any learning plan — PDF, Excel, CSV, DOCX, Markdown, or JSON. Our AI parser handles it automatically.
          </p>
        </div>

        {/* Supported formats */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {['PDF', 'Excel', 'CSV', 'Word', 'Markdown', 'TXT', 'JSON'].map(f => (
            <span key={f} style={{
              padding: '4px 12px', background: 'rgba(79,142,247,0.08)',
              border: '1px solid rgba(79,142,247,0.2)', borderRadius: 8,
              fontSize: '0.75rem', color: '#4f8ef7', fontWeight: 600,
            }}>{f}</span>
          ))}
        </div>

        {/* Drop Zone */}
        <div
          className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
          style={{ marginBottom: 24, cursor: 'pointer' }}
        >
          <input
            id="file-input"
            type="file"
            accept={ACCEPTED}
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />
          {parsing ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <Loader2 size={40} color="#4f8ef7" style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ color: '#4f8ef7', fontWeight: 600 }}>Parsing your roadmap...</p>
              <p style={{ color: '#475569', fontSize: '0.8rem' }}>Our AI is extracting topics from {file?.name}</p>
            </div>
          ) : file && parsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <CheckCircle2 size={40} color="#22c55e" />
              <p style={{ fontWeight: 700, color: '#22c55e', fontSize: '1.1rem' }}>{parsed.length} topics extracted!</p>
              <p style={{ color: '#475569', fontSize: '0.8rem' }}>{file.name}</p>
              <button onClick={e => { e.stopPropagation(); setFile(null); setParsed(null); setTitle(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Inter, sans-serif' }}>
                <X size={14} /> Remove file
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 20,
                background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Upload size={28} color="#4f8ef7" />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>
                  Drop your roadmap here or <span style={{ color: '#4f8ef7' }}>browse files</span>
                </p>
                <p style={{ color: '#475569', fontSize: '0.8rem' }}>
                  Supports PDF, Excel, CSV, Word, Markdown, TXT, JSON
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12, padding: '14px 18px', marginBottom: 20,
          }}>
            <AlertCircle size={18} color="#ef4444" />
            <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</span>
          </div>
        )}

        {/* Title + Save */}
        {parsed && (
          <div className="glass" style={{ padding: 28, marginBottom: 24 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Configure Your Roadmap</h3>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>
                Roadmap Title *
              </label>
              <input
                type="text"
                className="input-glass"
                placeholder="e.g., Python Mastery Plan, GATE 2025, DevOps Roadmap"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Stats preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Total Days', value: parsed.length, color: '#4f8ef7' },
                { label: 'Milestones', value: parsed.filter(d => d.milestone).length, color: '#f59e0b' },
                { label: 'Est. Hours', value: Math.round(parsed.reduce((a, d) => a + (d.estimatedMinutes || 90), 0) / 60), color: '#22c55e' },
              ].map(s => (
                <div key={s.label} style={{
                  background: `${s.color}10`, border: `1px solid ${s.color}25`,
                  borderRadius: 12, padding: '14px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Preview toggle */}
            <button
              onClick={() => setPreview(p => !p)}
              className="btn-ghost"
              style={{ marginBottom: 20, fontSize: '0.85rem' }}
            >
              <Eye size={16} />
              {preview ? 'Hide' : 'Preview'} Topics ({parsed.length})
            </button>

            {preview && (
              <div style={{
                maxHeight: 320, overflowY: 'auto',
                background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 4,
                marginBottom: 20,
              }}>
                {parsed.map((d, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 12px', borderBottom: i < parsed.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#475569', minWidth: 48, fontWeight: 600 }}>Day {d.day}</span>
                    <FileText size={12} color="#4f8ef7" />
                    <span style={{ fontSize: '0.875rem', color: '#94a3b8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.topic}
                    </span>
                    {d.milestone && <span style={{ fontSize: '0.65rem', color: '#f59e0b' }}>⭐ Milestone</span>}
                    <span style={{ fontSize: '0.65rem', color: '#475569' }}>{d.estimatedMinutes}m</span>
                  </div>
                ))}
              </div>
            )}

            {roadmap && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: '0.8rem', color: '#f59e0b',
              }}>
                <AlertCircle size={15} />
                This will replace your existing roadmap and reset all progress!
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={!title.trim() || saving}
              className="btn-primary"
              style={{ fontSize: '0.95rem', padding: '13px 28px', opacity: !title.trim() || saving ? 0.6 : 1 }}
            >
              {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={18} />}
              {saving ? 'Saving...' : `Save Roadmap & Start Journey`}
            </button>
          </div>
        )}

        {/* Sample format guide */}
        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16 }}>Supported Roadmap Formats</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { title: 'Day-by-Day Format', code: 'Day 1: Python Basics\nDay 2: Variables & Types\nDay 3: Control Flow' },
              { title: 'Week Format', code: 'Week 1: Python Fundamentals\nWeek 2: OOP Concepts\nWeek 3: Projects' },
              { title: 'Simple List', code: '- Python\n- JavaScript\n- React\n- Node.js\n- MongoDB' },
            ].map(ex => (
              <div key={ex.title} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4f8ef7', marginBottom: 8 }}>{ex.title}</div>
                <pre style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'pre-wrap', fontFamily: 'monospace', margin: 0 }}>{ex.code}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
