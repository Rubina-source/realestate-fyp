import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, ChevronDown, Settings, LogOut, Sun, Moon, LayoutDashboard } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUserSuccess } from '../redux/user/userSlice';

export default function Header({ onProfileClick, darkMode, setDarkMode }) {
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser } = useSelector((s) => s.user);
  const dropRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = ['/', '/home'].includes(location.pathname);
  const fallbackAvatar = 'https://ui-avatars.com/api/?background=0D2A4A&color=fff&name=U';

  /* scroll detection */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* close dropdown on outside click */
  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const handleSignOut = async () => {
    try { await fetch('/api/auth/signout'); } catch { }
    dispatch(signOutUserSuccess());
    setDropOpen(false);
    navigate('/');
  };

  const getDashPath = () => {
    if (!currentUser) return '/';
    if (currentUser.role === 'admin') return '/admin-dashboard';
    if (currentUser.role === 'broker') return '/broker-dashboard';
    return '/listings';
  };

  /* ── nav style logic ── */
  // On home page before scroll: transparent over hero image
  const transparent = isHome && !scrolled;
  const navBg = transparent
    ? 'bg-transparent'
    : darkMode
      ? 'bg-[#08192d] border-b border-[#112236] shadow-xl'
      : 'bg-white border-b border-slate-100 shadow-sm';

  const logoColor = transparent ? 'text-white' : darkMode ? 'text-white' : 'text-[#0D2A4A]';
  const linkColor = transparent
    ? 'text-white/90 hover:text-white'
    : darkMode
      ? 'text-slate-300 hover:text-white'
      : 'text-slate-600 hover:text-[#0D2A4A]';

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-0 shrink-0">
          <span className={`font-black text-2xl tracking-tight transition-colors ${logoColor}`}>Ghar</span>
          <span className="font-black text-2xl tracking-tight text-[#F26419]">Rush</span>
        </Link>

        {/* ── Nav links ── */}
        <ul className={`hidden md:flex items-center gap-8 text-[13px] font-semibold ${linkColor}`}>
          <li><Link to="/" className="transition-colors">Home</Link></li>
          <li><Link to="/listings" className="transition-colors">Listings</Link></li>
          <li><Link to="/about" className="transition-colors">About</Link></li>
          <li><Link to="/contact" className="transition-colors">Contact</Link></li>
        </ul>

        {/* ── Right controls ── */}
        <div className="flex items-center gap-2.5">

          {/* Dark / Light toggle — always visible in header */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
              ${transparent
                ? 'text-white/70 hover:bg-white/10 hover:text-white'
                : darkMode
                  ? 'bg-[#112236] border border-[#1e3a5f] text-yellow-300 hover:bg-[#162d47]'
                  : 'bg-slate-100 text-slate-500 hover:bg-sky-100 hover:text-[#0D2A4A] border border-slate-200'
              }`}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">

              {/* Dashboard quick-link */}
              <Link
                to={getDashPath()}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${transparent
                    ? 'text-white/80 hover:bg-white/10'
                    : darkMode
                      ? 'text-sky-400 hover:bg-[#112236]'
                      : 'text-[#0D2A4A] hover:bg-slate-100'
                  }`}
              >
                <LayoutDashboard size={13} />
                {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'broker' ? 'Dashboard' : 'Browse'}
              </Link>

              {/* Avatar + dropdown */}
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className={`flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full border transition-all
                    ${transparent
                      ? 'border-white/20 hover:bg-white/10'
                      : darkMode
                        ? 'border-[#1e3a5f] bg-[#0f2035] hover:bg-[#112236]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                >
                  <img
                    src={currentUser.avatar || fallbackAvatar}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover"
                    onError={(e) => { e.target.src = fallbackAvatar; }}
                  />
                  <span className={`hidden sm:block text-xs font-bold ${transparent ? 'text-white' : darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    {(currentUser.username || 'User').split(' ')[0]}
                  </span>
                  <ChevronDown size={11} className={transparent ? 'text-white/50' : 'text-slate-400'} />
                </button>

                {dropOpen && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-2xl overflow-hidden
                    ${darkMode ? 'bg-[#0a1e33] border-[#1e3a5f]' : 'bg-white border-slate-100'}`}>
                    {/* User info */}
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-[#1e3a5f]' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-3">
                        <img src={currentUser.avatar || fallbackAvatar} alt="" className="w-8 h-8 rounded-full object-cover" onError={(e) => { e.target.src = fallbackAvatar; }} />
                        <div>
                          <p className={`text-sm font-bold truncate max-w-[130px] ${darkMode ? 'text-white' : 'text-slate-800'}`}>{currentUser.username}</p>
                          <p className={`text-[11px] capitalize ${darkMode ? 'text-sky-400' : 'text-[#77B6EA]'}`}>{currentUser.role || 'Member'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link to="/profile" onClick={() => setDropOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${darkMode ? 'text-slate-300 hover:bg-[#112236]' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <Settings size={13} /> Account Settings
                      </Link>
                      <Link to={getDashPath()} onClick={() => setDropOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${darkMode ? 'text-slate-300 hover:bg-[#112236]' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <LayoutDashboard size={13} />
                        {currentUser.role === 'admin' ? 'Admin Dashboard' : currentUser.role === 'broker' ? 'Broker Dashboard' : 'Browse Properties'}
                      </Link>
                    </div>

                    <div className={`border-t ${darkMode ? 'border-[#1e3a5f]' : 'border-slate-100'}`}>
                      <button onClick={handleSignOut}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 transition-colors ${darkMode ? 'hover:bg-red-950/30' : 'hover:bg-red-50'}`}>
                        <LogOut size={13} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={onProfileClick}
              className={`flex items-center gap-2 text-[13px] font-bold px-4 py-2 rounded-xl transition-all
                ${transparent
                  ? 'border border-white/30 text-white hover:bg-white/10'
                  : darkMode
                    ? 'border border-[#1e3a5f] text-slate-200 hover:bg-[#112236]'
                    : 'border border-slate-200 text-[#0D2A4A] hover:bg-slate-50'
                }`}
            >
              <User size={14} /> Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
