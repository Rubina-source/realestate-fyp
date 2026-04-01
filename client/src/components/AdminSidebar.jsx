import { useState } from "react";
import {
  ChevronDown,
  Users,
  CheckCircle,
  Clock,
  BarChart3,
  MapPin,
  Upload,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
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
      className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-screen overflow-y-auto sticky top-0 flex flex-col"
    >
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold text-center">
          Admin
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {/* Dashboard */}
        <Link
          to="/admin/dashboard"
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

        {/* Brokers Section */}
        <div>
          <button
            onClick={() => toggleSection("brokers")}
            className="cursor-pointer w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Brokers</span>
            </div>
            <ChevronDown
              size={14}
              className={`transition-transform ${expandedSections.brokers ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSections.brokers && (
            <div className="ml-3 mt-1 space-y-0.5 border-l border-neutral-200 dark:border-neutral-700 pl-3">
              <Link
                to="/admin/brokers/pending"
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${isActive("/admin/brokers/pending")
                  ? "bg-neutral-100 dark:bg-neutral-800"
                  : ""
                  }`}
              >
                <Clock size={12} />
                Pending
              </Link>

              <Link
                to="/admin/brokers"
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${isActive("/admin/brokers")
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

        {/* Listings Section */}
        <div>
          <button
            onClick={() => toggleSection("listings")}
            className="cursor-pointer w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors"
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={16} />
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
                to="/admin/listings/pending"
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${isActive("/admin/listings/pending")
                  ? "bg-neutral-100 dark:bg-neutral-800"
                  : ""
                  }`}
              >
                <Clock size={12} />
                Pending
              </Link>

              <Link
                to="/admin/listings"
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${isActive("/admin/listings")
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

        <div>
          <Link
            to="/admin/properties/import"
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${isActive("/admin/listings")
              ? "bg-neutral-100 dark:bg-neutral-800"
              : ""
              }`}
          >
            <Upload size={16} />
            <span>Import Properties</span>
          </Link>
        </div>

        {/* Users Section */}
        <div>
          <button
            onClick={() => toggleSection("users")}
            className="cursor-pointer w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Users</span>
            </div>
            <ChevronDown
              size={14}
              className={`transition-transform ${expandedSections.users ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSections.users && (
            <div className="ml-3 mt-1 space-y-0.5 border-l border-neutral-200 dark:border-neutral-700 pl-3">
              <Link
                to="/admin/users"
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${isActive("/admin/users")
                  ? "bg-neutral-100 dark:bg-neutral-800"
                  : ""
                  }`}
              >
                <Users size={12} />
                All Users
              </Link>
            </div>
          )}
        </div>

        {/* Cities Section */}
        <div>
          <button
            onClick={() => toggleSection("cities")}
            className="cursor-pointer w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Cities</span>
            </div>
            <ChevronDown
              size={14}
              className={`transition-transform ${expandedSections.cities ? "rotate-180" : ""}`}
            />
          </button>

          {expandedSections.cities && (
            <div className="ml-3 mt-1 space-y-0.5 border-l border-neutral-200 dark:border-neutral-700 pl-3">
              <Link
                to="/admin/cities"
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${isActive("/admin/cities")
                  ? ""
                  : ""
                  }`}
              >
                <MapPin size={12} />
                Manage
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
