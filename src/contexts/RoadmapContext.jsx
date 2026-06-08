import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  doc, getDoc, setDoc, updateDoc, collection,
  addDoc, query, orderBy, getDocs, serverTimestamp, onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { todayStr, yesterdayStr, daysBetween } from '../utils/dateHelpers';
import { XP_REWARDS, calculateXP } from '../utils/xpSystem';

const RoadmapContext = createContext(null);

export function RoadmapProvider({ children }) {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real-time listener for progress
  useEffect(() => {
    if (!user) { setRoadmap(null); setProgress(null); setLoading(false); return; }

    setLoading(true);

    const progressRef = doc(db, 'progress', user.uid);
    const roadmapRef = doc(db, 'roadmaps', user.uid);

    let unsubProgress;
    let unsubRoadmap;

    const loadData = async () => {
      const [progressSnap, roadmapSnap] = await Promise.all([
        getDoc(progressRef),
        getDoc(roadmapRef),
      ]);

      if (roadmapSnap.exists()) setRoadmap(roadmapSnap.data());
      else setRoadmap(null);

      if (progressSnap.exists()) {
        const p = progressSnap.data();
        // Check streak
        const updated = await checkAndUpdateStreak(p, user.uid);
        setProgress(updated || p);
      } else {
        setProgress(null);
      }

      setLoading(false);
    };

    loadData();

    // Subscribe to live updates
    unsubProgress = onSnapshot(progressRef, (snap) => {
      if (snap.exists()) setProgress(snap.data());
    });

    unsubRoadmap = onSnapshot(roadmapRef, (snap) => {
      if (snap.exists()) setRoadmap(snap.data());
      else setRoadmap(null);
    });

    return () => {
      unsubProgress?.();
      unsubRoadmap?.();
    };
  }, [user]);

  // ── Streak logic ──
  async function checkAndUpdateStreak(p, uid) {
    if (!p) return p;
    const today = todayStr();
    const yesterday = yesterdayStr();
    const last = p.lastCompletedDate;

    if (!last) return p;
    if (last === today) return p; // already up-to-date

    // Missed a day → reset streak
    if (last !== yesterday) {
      const updated = { ...p, currentStreak: 0 };
      await updateDoc(doc(db, 'progress', uid), { currentStreak: 0 });
      return updated;
    }
    return p;
  }

  // ── Save new roadmap ──
  async function saveRoadmap(parsedDays, title, fileName) {
    if (!user) return;
    const today = todayStr();

    const roadmapData = {
      title: title || fileName,
      fileName,
      uploadedAt: serverTimestamp(),
      totalDays: parsedDays.length,
      parsedDays,
    };

    const progressData = {
      currentDay: 1,
      completedDays: [],
      totalDays: parsedDays.length,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      startedAt: today,
      history: {},
      totalMinutes: 0,
      xp: 0,
    };

    await Promise.all([
      setDoc(doc(db, 'roadmaps', user.uid), roadmapData),
      setDoc(doc(db, 'progress', user.uid), progressData),
    ]);

    setRoadmap(roadmapData);
    setProgress(progressData);
  }

  // ── Complete a day ──
  async function completeDay(dayIndex, summary, minutesSpent = 90) {
    if (!user || !progress || !roadmap) {
      throw new Error('User, progress, or roadmap not found');
    }

    const today = todayStr();
    const isCurrentDay = progress.currentDay === dayIndex;
    
    // Return early with more explicit error handling
    if (!isCurrentDay) {
      throw new Error(`Cannot complete Day ${dayIndex}. Current day is ${progress.currentDay}. Days must be completed sequentially.`);
    }

    const alreadyCompleted = progress.completedDays.includes(dayIndex);
    if (alreadyCompleted) {
      throw new Error(`Day ${dayIndex} has already been completed`);
    }

    // Streak calculation
    const last = progress.lastCompletedDate;
    const yesterday = yesterdayStr();
    let newStreak = 1;
    if (last === yesterday) {
      newStreak = (progress.currentStreak || 0) + 1;
    } else if (last === today) {
      newStreak = progress.currentStreak || 1;
    }

    const newLongest = Math.max(progress.longestStreak || 0, newStreak);
    const newCompletedDays = [...progress.completedDays, dayIndex];
    const newCurrentDay = dayIndex + 1; // Increment to unlock next day
    const newTotalMinutes = (progress.totalMinutes || 0) + minutesSpent;

    // XP
    let xpGain = XP_REWARDS.DAY_COMPLETE;
    if (summary.length > 200) xpGain += XP_REWARDS.LONG_SUMMARY;
    const newXP = (progress.xp || 0) + xpGain;

    const newHistory = { ...(progress.history || {}), [today]: true };

    // **OPTIMISTIC UPDATE**: Update local state immediately before Firestore
    const optimisticProgress = {
      ...progress,
      completedDays: newCompletedDays,
      currentDay: newCurrentDay, // This immediately unlocks the next day
      lastCompletedDate: today,
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalMinutes: newTotalMinutes,
      xp: newXP,
      history: newHistory,
    };
    setProgress(optimisticProgress);

    // Now persist to Firestore
    const updates = {
      completedDays: newCompletedDays,
      currentDay: newCurrentDay,
      lastCompletedDate: today,
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalMinutes: newTotalMinutes,
      xp: newXP,
      history: newHistory,
    };

    try {
      await updateDoc(doc(db, 'progress', user.uid), updates);

      // Save to journal
      await setDoc(doc(db, 'journals', user.uid, 'entries', today), {
        date: today,
        dayIndex,
        topic: roadmap.parsedDays[dayIndex - 1]?.topic || '',
        summary,
        minutesSpent,
        xpEarned: xpGain,
        createdAt: serverTimestamp(),
      }, { merge: true });

      // Update user XP
      await updateDoc(doc(db, 'users', user.uid), { xp: newXP });

      // Check achievements
      await checkAchievements(newCompletedDays, newStreak, newTotalMinutes);

      return { xpGain, newStreak, newCurrentDay };
    } catch (error) {
      // Revert optimistic update on error
      setProgress(progress);
      throw new Error(`Failed to complete day: ${error.message}`);
    }
  }

  // ── Achievements ──
  async function checkAchievements(completedDays, streak, totalMinutes) {
    if (!user) return;
    const achRef = doc(db, 'achievements', user.uid);
    const snap = await getDoc(achRef);
    const existing = snap.exists() ? snap.data().earned || [] : [];
    const earnedIds = existing.map(a => a.id);

    const newOnes = [];
    const now = new Date().toISOString();

    if (!earnedIds.includes('first_day') && completedDays.length >= 1)
      newOnes.push({ id: 'first_day', name: 'First Step', earnedAt: now });
    if (!earnedIds.includes('streak_3') && streak >= 3)
      newOnes.push({ id: 'streak_3', name: '3-Day Streak', earnedAt: now });
    if (!earnedIds.includes('streak_7') && streak >= 7)
      newOnes.push({ id: 'streak_7', name: 'Week Warrior', earnedAt: now });
    if (!earnedIds.includes('streak_30') && streak >= 30)
      newOnes.push({ id: 'streak_30', name: 'Consistency Master', earnedAt: now });
    if (!earnedIds.includes('days_10') && completedDays.length >= 10)
      newOnes.push({ id: 'days_10', name: '10 Days Done', earnedAt: now });
    if (!earnedIds.includes('days_30') && completedDays.length >= 30)
      newOnes.push({ id: 'days_30', name: '30 Days Done', earnedAt: now });
    if (!earnedIds.includes('hours_10') && totalMinutes >= 600)
      newOnes.push({ id: 'hours_10', name: '10 Hours Logged', earnedAt: now });
    if (!earnedIds.includes('hours_100') && totalMinutes >= 6000)
      newOnes.push({ id: 'hours_100', name: '100 Hours Logged', earnedAt: now });
    if (!earnedIds.includes('roadmap_complete') && roadmap && completedDays.length >= roadmap.totalDays)
      newOnes.push({ id: 'roadmap_complete', name: 'Roadmap Completed!', earnedAt: now });

    if (newOnes.length > 0) {
      await setDoc(achRef, { earned: [...existing, ...newOnes] }, { merge: true });
    }

    return newOnes;
  }

  // ── Journal entry ──
  async function saveJournalEntry(date, entry) {
    if (!user) return;
    await setDoc(doc(db, 'journals', user.uid, 'entries', date), {
      ...entry,
      date,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  async function getJournalEntries() {
    if (!user) return [];
    const q = query(
      collection(db, 'journals', user.uid, 'entries'),
      orderBy('date', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  }

  async function getAchievements() {
    if (!user) return [];
    const snap = await getDoc(doc(db, 'achievements', user.uid));
    return snap.exists() ? snap.data().earned || [] : [];
  }

  const value = {
    roadmap,
    progress,
    loading,
    saveRoadmap,
    completeDay,
    saveJournalEntry,
    getJournalEntries,
    getAchievements,
    checkAchievements,
  };

  return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>;
}

export function useRoadmap() {
  const ctx = useContext(RoadmapContext);
  if (!ctx) throw new Error('useRoadmap must be inside RoadmapProvider');
  return ctx;
}
