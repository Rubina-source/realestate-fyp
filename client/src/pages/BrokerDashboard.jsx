import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { propertyService } from "../services/apiService";
import { Plus, Edit, Trash2, Home, Eye, MessageCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import BrokerLayout from "../components/BrokerLayout";

export default function BrokerDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    views: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await propertyService.getBrokerProperties({
        limit: 100,
      });
      setProperties(response.data.properties);

      // Calculate stats
      const pending = response.data.properties.filter(
        (p) => p.status === "pending",
      ).length;
      const approved = response.data.properties.filter(
        (p) => p.status === "approved",
      ).length;
      const rejected = response.data.properties.filter(
        (p) => p.status === "rejected",
      ).length;
      const totalViews = response.data.properties.reduce(
        (sum, p) => sum + (p.views || 0),
        0,
      );

      setStats({
        total: response.data.properties.length,
        pending,
        approved,
        rejected,
        views: totalViews,
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
          <h1
            className="text-4xl md:text-4xl font-bold mb-1"
          >
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm">
            Manage your property listings and track inquiries
          </p>
        </div>
        <Link
          to="/broker/listings/new"
          className="flex items-center gap-2 px-5 py-3 bg-orange-500 text-white hover:bg-orange-500/80 font-semibold rounded-lg transition whitespace-nowrap"
        >
          <Plus size={20} />
          List a New Property
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Active Listings */}
          <div className="rounded-lg p-6 border border-[#E0E0E0] dark:border-[#2E2E3E]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-1">
                  Active Listings
                </p>
                <p className="text-3xl font-bold">
                  {stats.approved}
                </p>
                <p className="text-xs mt-2">
                  Properties currently visible
                </p>
              </div>
              <div className="p-3 rounded-lg">
                <Home size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrokerLayout>
  );
}
