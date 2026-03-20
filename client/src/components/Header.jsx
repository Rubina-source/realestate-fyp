import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Phone } from 'lucide-react';

export default function Header({ onProfileClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated visibility logic: Always using Dark Green for Ghar to ensure it is visible 
  // on both the white background and the image background.
  const navBgClass = (!isScrolled && isHomePage)
    ? "bg-transparent border-transparent py-6"
    : "bg-white shadow-md border-b border-slate-100 py-4";

  const linkColorClass = (!isScrolled && isHomePage) 
    ? "text-slate-800" // Changed from white to slate so you can see it against the light image
    : "text-slate-600";

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${navBgClass}`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8">
        
        {/* LOGO - Fixed Visibility */}
        <Link to="/">
          <h1 className="font-extrabold text-2xl flex items-center">
            <span className="text-[#1F3E35]">Ghar</span>
            <span className="text-[#E7C873]">Rush</span>
          </h1>
        </Link>

        {/* NAVIGATION LINKS */}
        <ul className={`hidden md:flex gap-10 font-bold text-[11px] uppercase tracking-widest ${linkColorClass}`}>
          <li className="hover:text-[#E7C873] transition-colors"><Link to="/">Home</Link></li>
          <li className="hover:text-[#E7C873] transition-colors"><Link to="/listings">Listings</Link></li>
          <li className="hover:text-[#E7C873] transition-colors"><Link to="/about">About</Link></li>
          <li className="hover:text-[#E7C873] transition-colors"><Link to="/contact">Contact</Link></li>
        </ul>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-6">
          <div className={`hidden lg:flex items-center gap-2 text-[11px] font-black uppercase tracking-wider ${linkColorClass}`}>
            <Phone size={14} className="text-[#E7C873]"/>
            <span>+977 9800000000</span>
          </div>
          
          <button 
            onClick={onProfileClick} 
            className="p-2 border border-[#1F3E35]/20 rounded-full hover:bg-slate-50 transition shadow-sm"
          >
            <User size={18} className="text-[#1F3E35]" />
          </button>

          <Link to="/create-listing">
            <button className="bg-[#1F3E35] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                Add Property
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}