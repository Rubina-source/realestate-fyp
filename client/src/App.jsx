import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import Header from './components/Header';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import CreateListing from './pages/CreateListing';
import AdminDashboard from './pages/AdminDashboard';
import BrokerDashboard from './pages/BrokerDashboard';

/* ─────────────────────────────────────────────────
   ROUTE GUARDS
───────────────────────────────────────────────── */
const PrivateRoute = () => {
  const u = useSelector((s) => s.user?.currentUser);
  return u ? <Outlet /> : <Navigate to="/" replace />;
};

const AdminRoute = () => {
  const u = useSelector((s) => s.user?.currentUser);
  return u?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

const BrokerRoute = () => {
  const u = useSelector((s) => s.user?.currentUser);
  return u?.role === 'broker' ? <Outlet /> : <Navigate to="/" replace />;
};

/**
 * Smart dashboard redirect:
 *   admin   → /admin-dashboard
 *   broker  → /broker-dashboard
 *   client  → /listings   (no separate client dashboard page)
 */
const DashboardRedirect = () => {
  const u = useSelector((s) => s.user?.currentUser);
  if (!u) return <Navigate to="/" replace />;
  if (u.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
  if (u.role === 'broker') return <Navigate to="/broker-dashboard" replace />;
  return <Navigate to="/listings" replace />;
};

/* ─────────────────────────────────────────────────
   APP
───────────────────────────────────────────────── */
export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // ── Dark mode: persisted in localStorage ──
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('gharrush_dark') === 'true'; }
    catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem('gharrush_dark', darkMode); } catch { }
    // Toggle Tailwind's 'dark' class on <html>
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const dm = darkMode; // shorthand to pass as prop

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: dm ? '#0f2035' : '#fff',
            color: dm ? '#e2e8f0' : '#1e293b',
            border: `1px solid ${dm ? '#1e3a5f' : '#e0f2fe'}`,
            borderRadius: '12px',
            fontSize: '13px',
          },
        }}
      />

      {/* Header always visible – holds dark mode toggle */}
      <Header
        onProfileClick={() => setIsAuthOpen(true)}
        darkMode={dm}
        setDarkMode={setDarkMode}
      />

      {/* Auth modal */}
      <SignIn
        key={isAuthOpen ? 'open' : 'closed'}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <main className={`min-h-screen transition-colors duration-300 ${dm ? 'bg-[#06101c] text-white' : 'bg-white text-slate-900'}`}>
        <Routes>
          {/* ── Public ── */}
          <Route path="/" element={<Home darkMode={dm} onAuthClick={() => setIsAuthOpen(true)} />} />
          <Route path="/home" element={<Home darkMode={dm} onAuthClick={() => setIsAuthOpen(true)} />} />
          <Route path="/listings" element={<Properties darkMode={dm} />} />
          <Route path="/listing/:listingId" element={<PropertyDetails darkMode={dm} />} />
          <Route path="/about" element={<About darkMode={dm} />} />
          <Route path="/contact" element={<Contact darkMode={dm} />} />

          {/* ── Any logged-in user ── */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile darkMode={dm} />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />
          </Route>

          {/* ── Broker only ── */}
          <Route element={<BrokerRoute />}>
            <Route path="/broker-dashboard" element={<BrokerDashboard darkMode={dm} />} />
            <Route path="/create-listing" element={<CreateListing darkMode={dm} />} />
          </Route>

          {/* ── Admin only ── */}
          <Route element={<AdminRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard darkMode={dm} />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
