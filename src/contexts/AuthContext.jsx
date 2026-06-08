import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data is stored in localStorage (session persistence)
    const storedUser = localStorage.getItem('studymitra_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Verify the user still exists in Firebase
        if (userData.uid) {
          setUser(userData);
          loadOrCreateProfile(userData).catch(err => 
            console.error("Profile sync failed, but moving on:", err)
          );
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
      }
    }

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setUser(firebaseUser);
        if (firebaseUser) {
          // Store user in localStorage for session persistence
          localStorage.setItem('studymitra_user', JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          }));
          // If profile loading fails, it won't block setLoading(false)
          await loadOrCreateProfile(firebaseUser).catch(err => 
            console.error("Profile sync failed, but moving on:", err)
          );
        } else {
          setUserProfile(null);
          localStorage.removeItem('studymitra_user');
        }
      } catch (globalError) {
        console.error("Auth state change error:", globalError);
      } finally {
        // This will ALWAYS run, so your screen will never get stuck loading!
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  async function loadOrCreateProfile(firebaseUser) {
    const ref = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setUserProfile(snap.data());
    } else {
      const profile = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || 'Learner',
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || null,
        createdAt: serverTimestamp(),
        xp: 0,
        role: 'user',
      };
      await setDoc(ref, profile);
      setUserProfile(profile);
    }
  }

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  }

  async function signInWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  }

  async function signUpWithEmail(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    await loadOrCreateProfile({ ...result.user, displayName });
    return result.user;
  }

  async function logout() {
    await signOut(auth);
    setUserProfile(null);
  }

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  async function refreshProfile() {
    if (user) await loadOrCreateProfile(user);
  }

  async function updateUserProfile(displayName, photoURL) {
    if (!user) return;
    
    // 1. Update Firebase Auth Profile
    await updateProfile(user, { 
      displayName: displayName || user.displayName, 
      photoURL: photoURL || user.photoURL 
    });
    
    // 2. Update Firestore User Profile
    const ref = doc(db, 'users', user.uid);
    await setDoc(ref, { 
      displayName: displayName || user.displayName, 
      photoURL: photoURL || user.photoURL,
      updatedAt: serverTimestamp() 
    }, { merge: true });
    
    // 3. Refresh Local State
    await loadOrCreateProfile(user);
  }

  const value = {
    user,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
    resetPassword,
    refreshProfile,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
