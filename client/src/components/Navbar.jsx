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

export default function Navbar({ transparent = false }) {
    const { isDark, toggleTheme } = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navBgClass = transparent
        ? "bg-transparent"
        : isDark
            ? "bg-[#1a1a1a]"
            : "bg-white";

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
                            href="/listings?type=sale"
                            label="BUY"
                            transparent={transparent}
                            isDark={isDark}
                        />
                        <NavLink
                            href="/listings?type=rent"
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
                        <NavLinkMobile href="/listings?type=sale" label="BUY" />
                        <NavLinkMobile href="/listings?type=rent" label="RENT" />
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
