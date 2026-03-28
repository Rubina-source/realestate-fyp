import { useState } from "react";
import {
  ChevronDown,
  Users,
  CheckCircle,
  Clock,
  BarChart3,
  MapPin,
  LandPlot,
  Plus,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BrokerSidebar() {
  const location = useLocation()
  const [expandedSections, setExpandedSections] = useState({
    brokers: location.pathname.includes("brokers"),
    listings: location.pathname.includes("listings"),
    users: location.pathname.includes("users"),
    cities: location.pathname.includes("cities"),
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className=" w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-screen overflow-y-auto sticky top-0 flex flex-col"
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold text-center">
          Broker Dashboard
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {/* Dashboard */}
        <Link
          to="/broker/dashboard"
          className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${isActive("/admin/dashboard")
            ? "bg-neutral-100 dark:bg-neutral-800"
            : ""
            }`}
        >
          <BarChart3 size={16} />
          <span>Dashboard</span>
        </Link>

        {/* Divider */}
        <div className="my-4" />
        {/* Listings Section */}
        <div>
          <button
            onClick={() => toggleSection("listings")}
            className="cursor-pointer w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors"
          >
            <div className="flex items-center gap-2">
              <LandPlot size={16} />
              <span>Listings</span>
            </div>
            <ChevronDown
              size={14}
              className={`transition-transform ${expandedSections.listings ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSections.listings && (
            <div className="ml-3 mt-1 space-y-0.5 border-l border-neutral-200 dark:border-neutral-700 pl-3">
              <Link
                to="/broker/listings/new"
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${isActive("/broker/listings/new")
                  ? "bg-neutral-100 dark:bg-neutral-800"
                  : ""
                  }`}
              >
                <Plus size={12} />
                New
              </Link>

              <Link
                to="/broker/listings"
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${isActive("/broker/listings/all")
                  ? "bg-neutral-100 dark:bg-neutral-800"
                  : ""
                  }`}
              >
                <Users size={12} />
                All
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
