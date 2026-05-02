import { useEffect, useState } from "react";
import { adminService } from "../services/apiService";
import AdminLayout from "../components/AdminLayout";
import { Users, Home, MessageSquare, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [propertyStats, setPropertyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchPropertyStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("@stats", stats);

  const fetchPropertyStats = async () => {
    try {
      const response = await adminService.getPropertyStats();
      setPropertyStats(response.data);
    } catch (error) {
      console.error("Failed to fetch property stats:", error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-neutral-200 dark:border-neutral-700 border-t-primary rounded-full mb-4"></div>
            <p className="font-medium">
              Loading dashboard...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Chart colors
  const COLORS = [
    "#006aff",
    "#1A1A2E",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
  ];

  // Stat Card Component
  const StatCard = ({ label, value, icon: Icon, color, trend }) => (
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center justify-between mb-3">
        <div className="space-y-1 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-medium">
            {value}
          </p>
        </div>
        <div className="p-2 rounded-lg">
          <Icon size={20} />
        </div>
      </div>
      {trend && (
        <p className="text-xs">{trend}</p>
      )}
    </div>
  );

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold  mb-2">
          Dashboard
        </h1>
        <p className="text-sm">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Users"
          value={stats?.users.total || 0}
          icon={Users}
          color="bg-blue-500"
          trend={`${stats?.users.brokers || 0} brokers, ${stats?.users.clients || 0} clients`}
        />
        <StatCard
          label="Total Listings"
          value={stats?.listings.total || 0}
          icon={Home}
          color="bg-emerald-500"
          trend={`${stats?.listings.approved || 0} approved`}
        />
        <StatCard
          label="Pending Approval"
          value={stats?.listings.pending || 0}
          icon={Clock}
          color="bg-amber-500"
          trend="Needs review"
        />
        <StatCard
          label="Pending Brokers"
          value={stats?.pendingBrokers || 0}
          icon={Users}
          color="bg-red-500"
          trend="Awaiting verification"
        />
        {/*  <StatCard
          label="Total Inquiries"
          value={stats?.inquiries || 0}
          icon={MessageSquare}
          color="bg-purple-500"
          trend="This month"
        /> */}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Property Type Chart */}
        {propertyStats?.propertyType &&
          propertyStats.propertyType.length > 0 && (
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
              <div className="mb-6">
                <h3 className="text-lg font-medium">
                  Properties by Type
                </h3>
                <p className="text-xs mt-1">
                  Distribution of approved listings
                </p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={propertyStats.propertyType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    className="text-xs"
                  >
                    {propertyStats.propertyType.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="text-xs"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

        {/* Purpose Chart */}
        {propertyStats?.purpose && propertyStats.purpose.length > 0 && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="mb-6">
              <h3 className="text-lg font-medium">
                Properties by Purpose
              </h3>
              <p className="text-xs mt-1">
                Sale vs Rent distribution
              </p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={propertyStats.purpose}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                />
                <Bar dataKey="value" fill="#006aff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Cities Chart */}
      {propertyStats?.cities && propertyStats.cities.length > 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700 mb-8">
          <div className="mb-6">
            <h3 className="text-lg font-medium">
              Top Performing Cities
            </h3>
            <p className="text-xs mt-1">
              Property count by city
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={propertyStats.cities} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
              />
              <Tooltip
              />
              <Bar dataKey="value" fill="#1A1A2E" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </AdminLayout>
  );
}
