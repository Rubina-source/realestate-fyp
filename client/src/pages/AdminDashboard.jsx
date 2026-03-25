import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Clock, CheckCircle, Building, PieChart as PieIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  const COLORS = ['#1F3E35', '#E7C873', '#FF5A3C', '#7ed6df'];

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

  const fetchData = async () => {
    try {
      const [listRes, statsRes] = await Promise.all([
        fetch('/api/listing/get?limit=50'),
        fetch('/api/listing/admin-stats')
      ]);
      const listData = await listRes.json();
      const statsData = await statsRes.json();
      setListings(listData);
      setStats(statsData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/listing/update-status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Property ${status.toLowerCase()} successfully`);
        fetchData();
      }
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const formatPrice = (price) => {
    return price ? `Rs. ${price.toLocaleString()}` : 'N/A';
  };

  const Icon = ({ name, size, color }) => {
    switch (name) {
      case 'clock': return <Clock size={size} color={color} />;
      case 'check-circle': return <CheckCircle size={size} color={color} />;
      case 'building': return <Building size={size} color={color} />;
      case 'pie': return <PieIcon size={size} color={color} />;
      default: return null;
    }
  };

  const properties = listings.map(l => ({
    id: l._id,
    title: l.title,
    city: l.city,
    type: l.type,
    category: l.category,
    price: l.price,
    status: l.status === 'pending' ? 'Pending' : (l.status === 'approved' ? 'Approved' : 'Rejected'),
    image: l.imageUrls?.[0] || 'https://via.placeholder.com/150',
    postedDate: new Date(l.createdAt).toLocaleDateString(),
    broker: l.userRef // Assuming userRef is the broker ID for now
  }));

  const tabs = [
    { id: "pending", label: "Pending", icon: "clock", count: properties.filter(p => p.status === "Pending").length },
    { id: "approved", label: "Approved", icon: "check-circle", count: properties.filter(p => p.status === "Approved").length },
    { id: "analytics", label: "Analytics", icon: "pie" },
  ];

  const filtered = properties.filter(p => activeTab === "analytics" ? true : p.status === (activeTab === "pending" ? "Pending" : "Approved"));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px 32px 24px" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 600, marginBottom: 8, color: '#0D2A4A' }}>Admin Dashboard</h1>
      <p style={{ color: t.textMuted, marginBottom: 32 }}>Manage property approvals and platform analytics</p>

      {/* Quick action cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Pending Approval", value: properties.filter(p => p.status === "Pending").length, icon: "clock", color: t.warning, bg: t.warning + "18" },
          { label: "Approved", value: properties.filter(p => p.status === "Approved").length, icon: "check-circle", color: t.success, bg: t.success + "18" },
          { label: "Total Properties", value: properties.length, icon: "building", color: t.info, bg: t.info + "18" },
        ].map(card => (
          <div key={card.label} className="card-hover" style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 24, boxShadow: t.shadow }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 4, color: '#0D2A4A' }}>{card.value}</div>
                <div style={{ fontSize: 14, color: t.textMuted }}>{card.label}</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={card.icon} size={22} color={card.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 28, background: t.bgCard, padding: 4, borderRadius: 12, border: `1px solid ${t.border}`, width: "fit-content" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 8, border: "none", background: activeTab === tab.id ? t.accent : "transparent", color: activeTab === tab.id ? "#fff" : t.textMuted, cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all 0.2s" }}>
            <Icon name={tab.icon} size={16} color={activeTab === tab.id ? "#fff" : t.textMuted} />
            {tab.label}
            {tab.count > 0 && <span style={{ background: activeTab === tab.id ? "rgba(255,255,255,0.25)" : "#F26419", color: "#fff", width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{tab.count}</span>}
          </button>
        ))}
      </div>

      {activeTab !== "analytics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: t.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <div style={{ fontWeight: 600 }}>No {activeTab} properties</div>
            </div>
          ) : filtered.map(p => (
            <div key={p.id} className="card-hover" style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 14, padding: 16, display: "flex", gap: 16, alignItems: "center", boxShadow: t.shadow }}>
              <img src={p.image} alt="" style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: '#0D2A4A' }}>{p.title}</div>
                <div style={{ fontSize: 13, color: t.textMuted }}>{p.city} · {p.type} · {formatPrice(p.price)}</div>
                <div style={{ fontSize: 12, color: t.textSubtle, marginTop: 2 }}>Posted: {p.postedDate}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {p.status !== "Approved" && <button onClick={() => updateStatus(p.id, "approved")} style={{ padding: "8px 16px", background: t.success, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Approve</button>}
                {p.status !== "Rejected" && <button onClick={() => updateStatus(p.id, "rejected")} style={{ padding: "8px 16px", background: "#E04040", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Reject</button>}
                {p.status !== "Pending" && <button onClick={() => updateStatus(p.id, "pending")} style={{ padding: "8px 16px", background: t.warning, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Pending</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "analytics" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div style={{ background: "white", padding: 32, borderRadius: 24, border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0D2A4A", marginBottom: 24 }}>Broker Performance</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.brokerStats}>
                  <XAxis dataKey="_id" fontSize={10} fontWeight="bold" />
                  <Tooltip />
                  <Bar dataKey="total" fill="#0D2A4A" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ background: "white", padding: 32, borderRadius: 24, border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0D2A4A", marginBottom: 24 }}>Property Category</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats?.categoryStats} dataKey="count" nameKey="_id" innerRadius={60} outerRadius={80}>
                    {stats?.categoryStats?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
