import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RoadmapProvider } from './contexts/RoadmapContext';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy-loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RoadmapUpload = lazy(() => import('./pages/RoadmapUpload'));
const RoadmapView = lazy(() => import('./pages/RoadmapView'));
const TodayMission = lazy(() => import('./pages/TodayMission'));
const Journal = lazy(() => import('./pages/Journal'));
const Analytics = lazy(() => import('./pages/Analytics'));
const AICoach = lazy(() => import('./pages/AICoach'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><RoadmapUpload /></PrivateRoute>} />
        <Route path="/roadmap" element={<PrivateRoute><RoadmapView /></PrivateRoute>} />
        <Route path="/today" element={<PrivateRoute><TodayMission /></PrivateRoute>} />
        <Route path="/journal" element={<PrivateRoute><Journal /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="/coach" element={<PrivateRoute><AICoach /></PrivateRoute>} />
        <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoadmapProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#0d1a2e',
                color: '#f1f5f9',
                border: '1px solid rgba(79,142,247,0.3)',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#0d1a2e' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#0d1a2e' },
              },
            }}
          />
        </RoadmapProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
