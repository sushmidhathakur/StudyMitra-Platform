import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRoadmap } from '../contexts/RoadmapContext';
import AppLayout from '../components/AppLayout';
import { User, Mail, Calendar, LogOut, Settings, Award, Upload, X } from 'lucide-react';
import { getLevelInfo } from '../utils/xpSystem';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, userProfile, logout, updateUserProfile } = useAuth();
  const { progress } = useRoadmap();
  const navigate = useNavigate();

  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(userProfile?.displayName || user?.displayName || 'Learner');
  const [uploading, setUploading] = useState(false);
  const [savingName, setSavingName] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = userProfile?.displayName || user?.displayName || 'Learner';
  const email = userProfile?.email || user?.email || '';
  const photoURL = userProfile?.photoURL || user?.photoURL;
  const joinDate = userProfile?.createdAt 
    ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString()
    : 'Unknown';

  const xpInfo = getLevelInfo(progress?.xp || 0);

  const handleNameUpdate = async () => {
    if (newName.trim() === displayName) {
      setEditName(false);
      return;
    }
    
    setSavingName(true);
    try {
      await updateUserProfile(newName.trim(), photoURL);
      toast.success('Profile name updated successfully!');
      setEditName(false);
    } catch (err) {
      toast.error('Failed to update name: ' + err.message);
    } finally {
      setSavingName(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Upload to Firebase Storage
      const fileRef = ref(storage, `profilePictures/${user.uid}/${Date.now()}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      
      // Update user profile with new photo URL
      await updateUserProfile(displayName, downloadURL);
      toast.success('Profile picture updated successfully!');
    } catch (err) {
      toast.error('Failed to upload picture: ' + err.message);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 className="section-title">My Profile</h1>
          <p className="section-subtitle">Manage your account and view your learning identity.</p>
        </div>

        <div className="glass" style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative', marginBottom: 20 }}>
            {photoURL ? (
              <img 
                src={photoURL} 
                alt={displayName}
                style={{
                  width: 100, height: 100, borderRadius: '50%',
                  border: '4px solid rgba(255,255,255,0.1)',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f8ef7, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem', fontWeight: 800, color: 'white',
                border: '4px solid rgba(255,255,255,0.1)'
              }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <label style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 32, height: 32, borderRadius: '50%',
              background: '#4f8ef7', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: '2px solid #0d1a2e', transition: 'all 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#5a9aff'}
            onMouseLeave={e => e.currentTarget.style.background = '#4f8ef7'}
            >
              <Upload size={16} color="white" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          
          {editName ? (
            <div style={{ marginBottom: 24, width: '100%', maxWidth: 300 }}>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="input-glass"
                style={{ marginBottom: 12, textAlign: 'center', fontSize: '1.2rem' }}
                placeholder="Enter your name"
                autoFocus
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleNameUpdate}
                  disabled={savingName}
                  className="btn-primary"
                  style={{ flex: 1, fontSize: '0.9rem' }}
                >
                  {savingName ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditName(false); setNewName(displayName); }}
                  className="btn-ghost"
                  style={{ flex: 1, fontSize: '0.9rem' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                {displayName}
                <button
                  onClick={() => setEditName(true)}
                  style={{
                    background: 'rgba(79,142,247,0.1)', border: 'none', borderRadius: 6,
                    padding: '4px 8px', cursor: 'pointer', color: '#4f8ef7',
                    fontSize: '0.8rem', fontWeight: 600
                  }}
                >
                  Edit
                </button>
              </h2>
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', marginBottom: 24 }}>
            <Mail size={16} /> {email}
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Award size={18} color="#f59e0b" />
              <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600 }}>Level {xpInfo.level} ({xpInfo.name})</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar size={18} color="#22c55e" />
              <span style={{ fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 600 }}>Joined {joinDate}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          <button className="glass" style={{
            padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)',
            cursor: 'pointer', textAlign: 'left', width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Settings size={20} color="#94a3b8" />
              <div>
                <div style={{ fontWeight: 600, color: '#f1f5f9' }}>Account Settings</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Email is read-only</div>
              </div>
            </div>
          </button>
          
          <button onClick={handleLogout} className="glass" style={{
            padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)',
            cursor: 'pointer', textAlign: 'left', width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <LogOut size={20} color="#ef4444" />
              <div>
                <div style={{ fontWeight: 600, color: '#ef4444' }}>Sign Out</div>
                <div style={{ fontSize: '0.8rem', color: '#fca5a5' }}>End your session</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
