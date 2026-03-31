import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Menu,
    X,
    Moon,
    Sun,
    LogOut,
    Settings,
    Bell,
    Heart,
    Home,
    Calculator,
    Users,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";

export default function Navbar({ transparent = false }) {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [accountDropdown, setAccountDropdown] = useState(false);
    const dropdownRef = useRef(null);


    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        setAccountDropdown(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setAccountDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navBgClass = transparent
        ? "bg-transparent"
        : isDark
            ? "bg-neutral-900 border-b border-b-neutral-800"
            : "bg-white border-b border-b-neutral-200";

    return (
        <nav className={`${navBgClass} sticky top-0 z-40`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        to="/"
                        className={`font-bold text-2xl flex items-center flex-shrink-0 ${transparent ? "text-[#333333]" : isDark ? "text-white" : "text-[#333333]"}`}
                    >
                        <span className="text-orange-500">Ghar</span>
                        <span
                            className={
                                transparent
                                    ? "text-white"
                                    : isDark
                                        ? "text-white"
                                        : "text-black"
                            }
                        >
                            Rush
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        <NavLink
                            href="/listings?purpose=sale"
                            label="BUY"
                            transparent={transparent}
                            isDark={isDark}
                        />
                        <NavLink
                            href="/listings?purpose=rent"
                            label="RENT"
                            transparent={transparent}
                            isDark={isDark}
                        />
                        <NavLink
                            href="/mortgage"
                            label="MORTGAGE"
                            transparent={transparent}
                            isDark={isDark}
                        />
                        <NavLink
                            href="/brokers"
                            label="FIND BROKER"
                            transparent={transparent}
                            isDark={isDark}
                        />
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        {user ? (
                            <>
                                {/* Quick Links */}
                                {user.role === "client" && (
                                    <Link
                                        to="/favorites"
                                        className={`p-2 hover:text-orange-500 ${transparent ? "text-white" : 'dark:text-white'} transition`}
                                        title="Favorites"
                                    >
                                        <Heart size={20} />
                                    </Link>
                                )}

                                {/* Account Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setAccountDropdown(!accountDropdown)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg transition cursor-pointer"
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm bg-white ${transparent ? "dark:text-black" : ""}`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        {/* <span className="text-sm font-medium">{user.name}</span> */}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {accountDropdown && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-950 overflow-hidden z-50">
                                            {/* Profile */}
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-3 px-4 py-3  border-b border-[#E0E0E0] dark:border-[#2E2E3E]"
                                                onClick={() => setAccountDropdown(false)}
                                            >
                                                <Home size={16} />
                                                <span className="text-sm">My Profile</span>
                                            </Link>

                                            {/* Settings */}
                                            <Link
                                                to="/settings"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition border-b border-[#E0E0E0] dark:border-[#2E2E3E]"
                                                onClick={() => setAccountDropdown(false)}
                                            >
                                                <Settings size={16} />
                                                <span className="text-sm">Account Settings</span>
                                            </Link>

                                            {/* Notifications */}
                                            <Link
                                                to="/notifications"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition border-b border-[#E0E0E0] dark:border-[#2E2E3E]"
                                                onClick={() => setAccountDropdown(false)}
                                            >
                                                <Bell size={16} />
                                                <span className="text-sm">Notifications</span>
                                            </Link>

                                            {/* Broker Upgrade (clients only) */}
                                            {user.role === "client" && (
                                                <Link
                                                    to="/broker-signup"
                                                    className="flex items-center gap-3 px-4 py-3 text-orange-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition border-b border-[#E0E0E0] dark:border-[#2E2E3E] font-medium"
                                                    onClick={() => setAccountDropdown(false)}
                                                >
                                                    <Users size={16} />
                                                    <span className="text-sm">Join as Broker</span>
                                                </Link>
                                            )}
                                            {user.role === "admin" && (
                                                <Link
                                                    to="/admin/dashboard"
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition border-b border-[#E0E0E0] dark:border-[#2E2E3E]"
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    <Settings size={16} />
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            {user.role === "broker" && (
                                                <Link
                                                    to="/broker/dashboard"
                                                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition border-b border-[#E0E0E0] dark:border-[#2E2E3E]"
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    <Settings size={16} />
                                                    Broker Dashboard
                                                </Link>
                                            )}

                                            {/* Logout */}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition text-left"
                                            >
                                                <LogOut size={16} />
                                                <span className="text-sm">Sign Out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-white hover:text-[#E8413B] transition text-sm font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/broker-signup"
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium"
                                >
                                    Join as Broker
                                </Link>
                            </>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg  transition dark:text-white"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#252535] transition text-[#333333] dark:text-[#E5E5E5]"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#252535] transition text-[#333333] dark:text-[#E5E5E5]"
                        >
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="lg:hidden pb-4 space-y-2 border-t border-[#E0E0E0] dark:border-[#2E2E3E]">
                        <NavLinkMobile href="/listings?purpose=sale" label="BUY" />
                        <NavLinkMobile href="/listings?purpose=rent" label="RENT" />
                        <NavLinkMobile href="/mortgage" label="MORTGAGE" />
                        <NavLinkMobile href="/brokers" label="REAL ESTATE BROKER" />
                    </div>
                )}
            </div>
        </nav>
    );
}

// Nav Link Component
function NavLink({ href, label, transparent, isDark }) {
    const textColor = transparent
        ? "text-white hover:text-orange-500"
        : isDark
            ? "text-white hover:text-orange-400"
            : "text-[#333333] hover:text-orange-500";

    return (
        <Link
            to={href}
            className={`px-3 py-2 transition text-sm font-medium ${textColor}`}
        >
            {label}
        </Link>
    );
}

// Mobile Nav Link Component
function NavLinkMobile({ href, label }) {
    return (
        <Link
            to={href}
            className="block px-4 py-3 text-balck dark:text-white hover:bg-white/50 dark:hover:bg-black/50 transition text-sm"
        >
            {label}
        </Link>
    );
}
