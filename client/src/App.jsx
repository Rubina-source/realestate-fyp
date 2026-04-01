import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import CreateListing from './pages/CreateListing';
import AdminDashboard from './pages/AdminDashboard';
import BrokerDashboard from './pages/BrokerDashboard';
import Navbar from './components/Navbar';
import { useTheme } from './hooks/useTheme';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuth } from './hooks/useAuth';
import AdminCities from './pages/AdminCities';
import AdminUsers from './pages/AdminUsers';
import BrokerSignup from './pages/BrokerSignup';
import AdminPendingBrokers from './pages/AdminBrokers';
import AdminAllBrokers from './pages/AdminAllBrokers';
import BrokerProperties from './pages/BrokerProperties';
import AdminListingsPending from './pages/AdminListingsPending';
import AdminAllListings from './pages/AdminAllListings';
import EditListing from './pages/EditListing';
import AdminPropertyImport from './pages/AdminPropertyImport';


const ProtectedRoute = ({ children, allowed }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowed && !allowed.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default function App() {
  const { isDark } = useTheme();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const dm = isDark;
  return (
    <>
      <Toaster
        position="top-center"
      />

      {!isHome && <Navbar />}

      <main className={`flex-1 bg-white dark:bg-neutral-900 text-black dark:text-white`}>
        <Routes>
          <Route path="/" element={
            <Home />
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/broker-signup" element={<BrokerSignup />} />
          <Route path="/listings" element={<Properties />} />
          <Route path="/listings/:id" element={<PropertyDetails />} />
          <Route path="/about" element={<About darkMode={dm} />} />
          <Route path="/contact" element={<Contact darkMode={dm} />} />

          {/* ── Any logged-in user ── */}
          <Route >
            <Route path="/profile" element={<Profile darkMode={dm} />} />
          </Route>

          {/* ── Broker only ── */}
          <Route
            path="/broker/dashboard"
            element={
              <ProtectedRoute allowed={["broker"]}>
                <BrokerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/broker/listings/new"
            element={
              <ProtectedRoute allowed={["broker"]}>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/broker/listings/edit/:id"
            element={
              <ProtectedRoute allowed={["broker"]}>
                <EditListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/broker/listings"
            element={
              <ProtectedRoute allowed={["broker"]}>
                <BrokerProperties />
              </ProtectedRoute>
            }
          />

          {/* ── Admin only ─ */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowed={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/brokers/pending"
            element={
              <ProtectedRoute allowed={["admin"]}>
                <AdminPendingBrokers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/brokers"
            element={
              <ProtectedRoute allowed={["admin"]}>
                <AdminAllBrokers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/listings"
            element={
              <ProtectedRoute allowed={["admin"]}>
                <AdminAllListings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/listings/pending"
            element={
              <ProtectedRoute allowed={["admin"]}>
                <AdminListingsPending />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowed={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/cities"
            element={
              <ProtectedRoute allowed={["admin"]}>
                <AdminCities />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/properties/import"
            element={
              <ProtectedRoute allowed={["admin"]}>
                <AdminPropertyImport />
              </ProtectedRoute>
            }
          />

          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes >
      </main >
    </>
  );
}
