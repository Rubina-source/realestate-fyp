import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, ChevronDown, Settings, LogOut, Phone } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUserSuccess } from '../redux/user/userSlice';

export default function Header({ onProfileClick }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { currentUser } = useSelector((state) => state.user);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const defaultAvatar = "https://images.icon-icons.com/1674/PNG/512/person_110935.png";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      dispatch(signOutUserSuccess());
      setIsDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const navBgClass = (!isScrolled && isHomePage) ? "bg-transparent py-6" : "bg-white shadow-md py-4";
  const linkColorClass = (!isScrolled && isHomePage) ? "text-slate-800" : "text-slate-600";

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${navBgClass}`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8">
        <Link to="/"><h1 className="font-extrabold text-2xl"><span className="text-[#1F3E35]">Ghar</span><span className="text-[#E7C873]">Rush</span></h1></Link>
        
        <ul className={`hidden md:flex gap-10 font-bold text-[11px] uppercase tracking-widest ${linkColorClass}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/listings">Listings</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <div className="flex items-center gap-6">
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-slate-100 rounded-full transition">
                <img src={currentUser.avatar || defaultAvatar} alt="user" className="h-9 w-9 rounded-full object-cover border-2 border-[#1F3E35]"/>
                <span className={`text-sm font-bold ${linkColorClass}`}>{currentUser.username}</span>
                <ChevronDown size={14} />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border py-4 overflow-hidden">
                  <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="w-full flex items-center gap-3 px-6 py-3 hover:bg-slate-50 text-slate-600 transition">
                    <Settings size={16} /> <span className="text-sm font-semibold">Account Settings</span>
                  </Link>
                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-6 py-3 hover:bg-red-50 text-red-500 transition border-t mt-2">
                    <LogOut size={16} /> <span className="text-sm font-bold uppercase">Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={onProfileClick} className="p-2 border border-[#1F3E35]/20 rounded-full hover:bg-slate-50 transition"><User size={18} className="text-[#1F3E35]" /></button>
          )}
        </div>
      </div>
    </header>
  );
}