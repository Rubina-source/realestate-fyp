import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';


// Essential Components
import Header from "./components/Header";
import SignIn from "./pages/SignIn";

// Public Pages
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Protected Pages
import Profile from "./pages/Profile";
import CreateListing from "./pages/CreateListing";

// Dashboard Pages (Ensure these files exist in your /pages folder)
import AdminDashboard from "./pages/AdminDashboard";
import BrokerDashboard from "./pages/BrokerDashboard";
import ClientDashboard from "./pages/ClientDashboard";

// --- SECURITY HELPERS (Route Guards) ---

// 1. PrivateRoute: Only logged-in users can enter
const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to='/' />;
};

// 2. AdminRoute: Only Admin can enter
const AdminRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.role === 'admin' ? <Outlet /> : <Navigate to='/' />;
};

// 3. BrokerRoute: Only Brokers can enter
const BrokerRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.role === 'broker' ? <Outlet /> : <Navigate to='/' />;
};

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Get current user from Redux to manage UI logic
  const { currentUser } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      {/* Header logic */}
      <Header onProfileClick={() => setIsModalOpen(true)} />

      {/* 
        The 'key={isModalOpen}' here is the MAGIC FIX. 
        It forces the SignIn component to reset its state every time it opens/closes,
        solving your ESLint "cascading render" error.
      */}
      <SignIn 
        key={isModalOpen} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <main className="min-h-screen">
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* --- LOGGED-IN ONLY (Any Role) --- */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* --- ADMIN ONLY --- */}
          <Route element={<AdminRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* --- BROKER ONLY --- */}
          <Route element={<BrokerRoute />}>
            <Route path="/broker-dashboard" element={<BrokerDashboard />} />
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>

          {/* --- CLIENT ONLY --- */}
          <Route element={<PrivateRoute />}>
             {/* Note: Standard clients use the private route to access their dashboard */}
            <Route path="/client-dashboard" element={<ClientDashboard />} />
          </Route>

          {/* 404 Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;