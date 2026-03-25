import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Building, CheckCircle, Clock, List, Plus, Bell, Upload } from 'lucide-react';
import CreateListing from './CreateListing';
import toast from 'react-hot-toast';

export default function BrokerDashboard() {
  const [activeTab, setActiveTab] = useState("listings");
  const [myListings, setMyListings] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const t = {
    bg: "#f8f9fa",
    bgCard: "#ffffff",
    border: "#f1f5f9",
    text: "#2F2F2F",
    textMuted: "#64748b",
    textSubtle: "#94a3b8",
    accent: "#0D2A4A",
    success: "#10b981",
    warning: "#f59e0b",
    info: "#3b82f6",
    shadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)"
  };

  const fetchMyListings = async () => {
    if (!currentUser?._id) return;
    try {
      const res = await fetch(`/api/listing/user/${currentUser._id}`);
      const data = await res.json();
      setMyListings(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeTab === 'listings') fetchMyListings();
  }, [activeTab, currentUser]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      const res = await fetch(`/api/listing/delete/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Listing Deleted");
        fetchMyListings();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const inquiries = [
    { id: 1, property: "Modern Villa in Lazimpat", client: "Sita Thapa", message: "Is this available for viewing?", time: "2 min ago" },
    { id: 2, property: "Cozy Apartment in Patan", client: "Ram B. KC", message: "What's included in the price?", time: "1 hr ago" },
  ];

  const tabs = [
    { id: "listings", label: "My Listings", icon: "list" },
    { id: "add", label: "Add Property", icon: "plus" },
    { id: "inquiries", label: "Inquiries", icon: "bell" },
  ];

  const formatPrice = (price) => {
    return price ? `Rs. ${price.toLocaleString()}` : 'N/A';
  };

  const getStatusColor = (status) => {
    if (status === 'approved') return t.success;
    if (status === 'rejected') return "#E04040";
    return t.warning;
  };

  const Icon = ({ name, size, color }) => {
    switch (name) {
      case 'building': return <Building size={size} color={color} />;
      case 'check-circle': return <CheckCircle size={size} color={color} />;
      case 'clock': return <Clock size={size} color={color} />;
      case 'list': return <List size={size} color={color} />;
      case 'plus': return <Plus size={size} color={color} />;
      case 'bell': return <Bell size={size} color={color} />;
      case 'upload': return <Upload size={size} color={color} />;
      default: return null;
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 32px 24px" }} className="fade-in">
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 600, marginBottom: 8, color: '#0D2A4A' }}>Broker Dashboard</h1>
      <p style={{ color: t.textMuted, marginBottom: 32 }}>Manage your listings and inquiries</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Listings", value: myListings.length, icon: "building", color: t.info },
          { label: "Approved", value: myListings.filter(p => p.status === "approved").length, icon: "check-circle", color: t.success },
          { label: "Pending", value: myListings.filter(p => p.status === "pending").length, icon: "clock", color: t.warning },
        ].map(stat => (
          <div key={stat.label} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 20, display: "flex", alignItems: "center", gap: 16, boxShadow: t.shadow }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: stat.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={stat.icon} size={22} color={stat.color} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#0D2A4A' }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: t.textMuted }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 28, background: t.bgCard, padding: 4, borderRadius: 12, border: `1px solid ${t.border}`, width: "fit-content" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, border: "none", background: activeTab === tab.id ? t.accent : "transparent", color: activeTab === tab.id ? "#fff" : t.textMuted, cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.2s" }}>
            <Icon name={tab.icon} size={16} color={activeTab === tab.id ? "#fff" : t.textMuted} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "listings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {myListings.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: t.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
              <div style={{ fontWeight: 600 }}>No properties listed yet</div>
            </div>
          ) : myListings.map(p => (
            <div key={p._id} className="card-hover" style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 16, display: "flex", gap: 16, alignItems: "center", boxShadow: t.shadow }}>
              <img src={p.imageUrls?.[0] || 'https://via.placeholder.com/150'} alt="" style={{ width: 72, height: 56, objectFit: "cover", borderRadius: 10 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#0D2A4A' }}>{p.title}</div>
                <div style={{ fontSize: 13, color: t.textMuted, marginTop: 2 }}>{p.city} · {p.type} · {formatPrice(p.price)}</div>
              </div>
              <div style={{ padding: "5px 14px", borderRadius: 100, fontSize: 13, fontWeight: 600, background: getStatusColor(p.status) + "18", color: getStatusColor(p.status) }}>
                {(p.status || 'pending').toUpperCase()}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleDelete(p._id)} style={{ padding: "7px 12px", borderRadius: 8, border: `1px solid #E04040`, background: "transparent", color: "#E04040", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "add" && <CreateListing />}

      {activeTab === "inquiries" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {inquiries.map(inq => (
            <div key={inq.id} className="card-hover" style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 20, boxShadow: t.shadow }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: '#0D2A4A' }}>{inq.property}</div>
                <div style={{ fontSize: 12, color: t.textSubtle }}>{inq.time}</div>
              </div>
              <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 12 }}>From: <strong style={{color: '#2F2F2F'}}>{inq.client}</strong></div>
              <div style={{ fontSize: 14, color: t.text, background: "#f8f9fa", padding: "10px 14px", borderRadius: 8, border: '1px solid #f1f5f9', marginBottom: 12 }}>{inq.message}</div>
              <button style={{ padding: "8px 16px", background: t.accent, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Reply</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}