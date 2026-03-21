import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

// Components
import Header from "./components/Header";
import SignIn from "./pages/SignIn";

// Pages (Ensure these files exist in your folders!)
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import BrokerDashboard from "./pages/BrokerDashboard";
import ClientDashboard from "./pages/ClientDashboard";

// --- SECURITY HELPERS ---
const PrivateRoute = () => {
  const user = useSelector((state) => state.user?.currentUser);
  return user ? <Outlet /> : <Navigate to='/' />;
};

const AdminRoute = () => {
  const user = useSelector((state) => state.user?.currentUser);
  return (user && user.role === 'admin') ? <Outlet /> : <Navigate to='/' />;
};

const BrokerRoute = () => {
  const user = useSelector((state) => state.user?.currentUser);
  return (user && user.role === 'broker') ? <Outlet /> : <Navigate to='/' />;
};

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <Header onProfileClick={() => setIsModalOpen(true)} />
      
      <SignIn 
        key={isModalOpen ? "open" : "closed"} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <main className="min-h-screen pt-20 bg-slate-50">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/listings" element={<Properties />} />
          <Route path="/listing/:listingId" element={<PropertyDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* User Profile */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin Dashboard */}
          <Route element={<AdminRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Broker Dashboard */}
          <Route element={<BrokerRoute />}>
            <Route path="/broker-dashboard" element={<BrokerDashboard />} />
          </Route>

          {/* Client Dashboard */}
          <Route element={<PrivateRoute />}>
            <Route path="/client-dashboard" element={<ClientDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;