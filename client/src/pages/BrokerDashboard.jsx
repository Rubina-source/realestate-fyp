import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { propertyService } from "../services/apiService";
import { Plus } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import BrokerLayout from "../components/BrokerLayout";

function StatCard({ label, value, description, extra }) {
  return (
    <div className="rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1">
            {label}
          </p>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold">{value}</p>
            {extra && (
              <span className="text-xs text-neutral-500 font-normal mb-1">
                {extra}
              </span>
            )}
          </div>
          <p className="text-xs mt-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BrokerDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    views: 0,
    viewsToday: 0,
    uniqueViewsToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await propertyService.getBrokerProperties({
        limit: 100,
      });
      setProperties(response.data.properties);

      // Calculate stats
      const pending = response.data.properties.filter((p) => p.status === "pending").length;
      const approved = response.data.properties.filter((p) => p.status === "approved").length;
      const rejected = response.data.properties.filter((p) => p.status === "rejected").length;

      // Calculate today's total views and unique views across all properties
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let totalViewsToday = 0;
      let uniqueIpsSet = new Set();

      response.data.properties.forEach((p) => {
        (p.viewHistory || []).forEach((v) => {
          const viewDate = new Date(v.viewedAt);
          viewDate.setHours(0, 0, 0, 0);
          if (viewDate.getTime() === today.getTime()) {
            totalViewsToday += 1;
            if (v.ip) {
              uniqueIpsSet.add(`${p._id}|${v.ip}`);
            }
          }
        });
      });

      setStats({
        total: response.data.properties.length,
        pending,
        approved,
        rejected,
        viewsToday: totalViewsToday,
        uniqueViewsToday: uniqueIpsSet.size,
      });
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      await propertyService.delete(id);
      setProperties(properties.filter((p) => p._id !== id));
      alert("Property deleted successfully");
    } catch (error) {
      alert("Failed to delete property");
    }
  };

  return (
    <BrokerLayout>
      {/* Welcome Header */}
      <div className="flex justify-between items-start gap-6">
        <div>
          <h1 className="text-4xl md:text-4xl font-bold mb-1">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm">
            Manage your property listings and track inquiries
          </p>
        </div>
        <Link
          to="/broker/listings/new"
          className="flex items-center gap-2 p-2 bg-blue-500 text-white hover:bg-blue-500/80 text-sm rounded-lg transition whitespace-nowrap"
        >
          <Plus size={20} />
          List a New Property
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Approved"
            value={stats.approved}
            description="Properties currently visible"
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            description="Awaiting admin approval"
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            description="Rejected by admin"
          />
          <StatCard
            label="Today's Views"
            value={stats.viewsToday ?? 0}
            extra={<span>{`${stats.uniqueViewsToday ?? 0} unique`}</span>}
            description="Today's views from all your listings"
          />
        </div>
      </div>
    </BrokerLayout>
  );
}
