// Firebase Configuration
// Replace these placeholder values with your actual Firebase project credentials
// Get them from: https://console.firebase.google.com → Project Settings → Your Apps

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * IMPORTANT: Firebase Authorized Domains Configuration
 * 
 * For password reset emails and authentication links to work on production,
 * you MUST add your deployment domains to Firebase Console:
 * 
 * Steps:
 * 1. Go to Firebase Console → Authentication → Settings
 * 2. Scroll to "Authorized domains"
 * 3. Add the following domains:
 *    - localhost (for local development)
 *    - study-mitra-platform.vercel.app (or your actual Vercel domain)
 *    - Any other custom domains you're using
 * 
 * These domains will receive authentication emails and handle password resets
 * from Firebase Auth.
 */

// Helper function to get the current domain for debugging
export function getCurrentDomain() {
  return window.location.hostname;
}

// Check if current domain is in the authorized list
export function isAuthorizedDomain() {
  const currentDomain = getCurrentDomain();
  const authorizedDomains = [
    'localhost',
    '127.0.0.1',
    'study-mitra-platform.vercel.app',
    // Add more authorized domains as needed
  ];
  
  return authorizedDomains.some(domain => 
    currentDomain === domain || currentDomain.endsWith(domain)
  );
}

export default app;
