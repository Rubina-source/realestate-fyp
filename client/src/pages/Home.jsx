import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, X, Building2, Home as HomeIcon,
  Warehouse, LandPlot, MapPin, CheckCircle, ArrowRight,
  TrendingUp, Shield, Clock, Users, ChevronDown, Star
} from 'lucide-react';
import PropertyCard from '../components/property/Propertycard';

/* ─── Price options — from CSV data (11,000 → 90,000,000) ─────────────── */
const MIN_PRICES = [
  { label: 'No min', value: '' },
  { label: 'Rs. 10,000', value: '10000' },
  { label: 'Rs. 25,000', value: '25000' },
  { label: 'Rs. 50,000', value: '50000' },
  { label: 'Rs. 1 Lakh', value: '100000' },
  { label: 'Rs. 5 Lakh', value: '500000' },
  { label: 'Rs. 10 Lakh', value: '1000000' },
  { label: 'Rs. 25 Lakh', value: '2500000' },
  { label: 'Rs. 50 Lakh', value: '5000000' },
  { label: 'Rs. 1 Crore', value: '10000000' },
  { label: 'Rs. 5 Crore', value: '50000000' },
];

const MAX_PRICES = [
  { label: 'No max', value: '' },
  { label: 'Rs. 25,000', value: '25000' },
  { label: 'Rs. 50,000', value: '50000' },
  { label: 'Rs. 1 Lakh', value: '100000' },
  { label: 'Rs. 5 Lakh', value: '500000' },
  { label: 'Rs. 10 Lakh', value: '1000000' },
  { label: 'Rs. 25 Lakh', value: '2500000' },
  { label: 'Rs. 50 Lakh', value: '5000000' },
  { label: 'Rs. 1 Crore', value: '10000000' },
  { label: 'Rs. 5 Crore', value: '50000000' },
  { label: 'Rs. 9 Crore', value: '90000000' },
];

const CITIES = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Jhapa', 'Kirtipur'];
const FACES = ['East', 'West', 'North', 'South', 'North East', 'North West', 'South East', 'South West'];

const QUICK_CATS = [
  { name: 'Apartment', icon: <Building2 size={22} />, query: 'Apartment', bg: 'bg-sky-50', ring: 'hover:border-sky-300', iconColor: 'text-sky-600' },
  { name: 'Residential', icon: <HomeIcon size={22} />, query: 'Residential', bg: 'bg-emerald-50', ring: 'hover:border-emerald-300', iconColor: 'text-emerald-600' },
  { name: 'Commercial', icon: <Warehouse size={22} />, query: 'Commercial', bg: 'bg-orange-50', ring: 'hover:border-orange-300', iconColor: 'text-orange-600' },
  { name: 'Land', icon: <LandPlot size={22} />, query: 'Land', bg: 'bg-violet-50', ring: 'hover:border-violet-300', iconColor: 'text-violet-600' },
];

const CITY_CARDS = [
  { city: 'Kathmandu', img: 'https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=500&q=70' },
  { city: 'Pokhara', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&q=70' },
  { city: 'Lalitpur', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&q=70' },
  { city: 'Bhaktapur', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70' },
];

/* ─── Helpers ──────────────────────────────────────────────────────────── */
const se = (d) => `${d ? 'bg-[#0D2A4A] text-white' : 'bg-white border-[#0D2A4A]/10 text-slate-600'} text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-lg transition-all`;

export default function Home({ darkMode, onAuthClick }) {
  const navigate = useNavigate();

  /* search state */
  const [tab, setTab] = useState('sale');
  const [term, setTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [face, setFace] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBed, setMinBed] = useState('');
  const [sort, setSort] = useState('createdAt_desc');

  /* listings */
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const go = async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/listing/get?limit=6&sort=createdAt&order=desc`);
        const d = await r.json();
        setRecent(Array.isArray(d) ? d : []);
      } catch { }
      setLoading(false);
    };
    go();
  }, []);

  /* build query and navigate */
  const handleSearch = () => {
    const p = new URLSearchParams();
    p.set('type', tab);
    if (term) p.set('searchTerm', term);
    if (city) p.set('city', city);
    if (category) p.set('category', category);
    if (face) p.set('face', face);
    if (minPrice) p.set('minPrice', minPrice);
    if (maxPrice) p.set('maxPrice', maxPrice);
    if (minBed) p.set('bedroom', minBed);
    const [s, o] = sort.split('_');
    p.set('sort', s); p.set('order', o);
    navigate(`/listings?${p}`);
  };

  const activeFiltersCount = [city, category, face, minPrice, maxPrice, minBed].filter(Boolean).length;

  /* theme tokens */
  const bg = darkMode ? 'bg-[#06101c]' : 'bg-white';
  const cardBg = darkMode ? 'bg-[#0a1e33]' : 'bg-white';
  const border = darkMode ? 'border-[#112236]' : 'border-slate-100';
  const txt = darkMode ? 'text-white' : 'text-[#0D2A4A]';
  const muted = darkMode ? 'text-slate-400' : 'text-slate-500';
  const secBg = darkMode ? 'bg-[#08192d]' : 'bg-slate-50';
  const inputBg = darkMode ? 'bg-[#0a1e33] border-[#1e3a5f] text-white placeholder-slate-500' : 'bg-slate-100 border-transparent text-slate-700 placeholder-slate-400';

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>

      {/* ══════════════════════════════════════════
          HERO  (matches existing style exactly)
      ══════════════════════════════════════════ */}
      <section className="relative h-screen flex flex-col justify-end items-start pb-24 px-8 md:px-16">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/2443590/pexels-photo-2443590.jpeg"
            className="w-full h-full object-cover brightness-[0.4]"
            alt="Hero"
          />
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tighter">
            Find it. Love it. Live it.
          </h1>
          <p className="text-base md:text-lg text-slate-200 mb-8 tracking-widest uppercase font-semibold">
            Real Estate, Real Fast.
          </p>

          {/* ── Search box ─────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-xl">
            {/* Buy / Rent tabs */}
            <div className="flex border-b border-slate-100">
              {['sale', 'rent'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-7 py-3 text-[10px] font-black uppercase tracking-widest transition-all
                    ${tab === t ? 'text-[#77B6EA]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {t}
                  {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#77B6EA]" />}
                </button>
              ))}
            </div>

            {/* Search row */}
            <div className="flex items-center gap-2 p-2">
              <div className="flex-1 flex items-center gap-2.5 px-4 py-2 bg-slate-100 rounded-xl">
                <Search className="text-slate-400 shrink-0" size={15} />
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search flat, house, or city..."
                  className="bg-transparent outline-none w-full text-xs font-medium text-slate-700 placeholder-slate-400"
                />
                {term && <button onClick={() => setTerm('')}><X size={13} className="text-slate-400" /></button>}
              </div>

              {/* Filter icon */}
              <button
                onClick={() => setShowFilters(true)}
                className={`relative p-2.5 rounded-xl border transition-all ${activeFiltersCount > 0
                  ? 'border-[#F26419] bg-[#F26419]/10 text-[#F26419]'
                  : 'border-slate-200 text-[#0D2A4A] hover:bg-slate-50'
                  }`}
              >
                <SlidersHorizontal size={15} />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#F26419] text-white text-[9px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleSearch}
                className="bg-[#F26419] hover:bg-[#d4551a] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-orange-500/20"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick city tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {CITIES.slice(0, 5).map((c) => (
              <button
                key={c}
                onClick={() => navigate(`/listings?city=${c}`)}
                className="flex items-center gap-1 text-white/70 hover:text-white text-[11px] font-medium bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/15 transition-all"
              >
                <MapPin size={9} /> {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUICK CATEGORIES
      ══════════════════════════════════════════ */}
      <section className={`py-14 ${secBg}`}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-xl font-black uppercase tracking-tight ${txt}`}>Browse by Type</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {QUICK_CATS.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/listings?category=${cat.query}`)}
                className={`group flex items-center gap-3 p-5 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md
                  ${darkMode
                    ? 'bg-[#0a1e33] border-[#112236] hover:border-[#1e3a5f]'
                    : `bg-white border-slate-100 ${cat.ring}`
                  }`}
              >
                <div className={`${darkMode ? 'text-sky-400' : cat.iconColor} group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <div className="text-left">
                  <div className={`text-xs font-black uppercase tracking-wider ${darkMode ? 'text-white' : 'text-[#0D2A4A]'}`}>{cat.name}</div>
                  <div className={`text-[10px] mt-0.5 ${muted}`}>View all →</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RECENT LISTINGS
      ══════════════════════════════════════════ */}
      <section className={`py-16 ${bg}`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[3px] mb-1 ${darkMode ? 'text-sky-400' : 'text-[#77B6EA]'}`}>Fresh picks</p>
              <h2 className={`text-2xl font-black uppercase tracking-tight ${txt}`}>Recent Listings</h2>
            </div>
            <Link to="/listings" className={`flex items-center gap-2 text-xs font-bold border px-4 py-2 rounded-xl transition-all
              ${darkMode ? 'border-[#1e3a5f] text-sky-400 hover:bg-[#0a1e33]' : 'border-[#0D2A4A]/20 text-[#0D2A4A] hover:bg-slate-50'}`}>
              View All <ArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className={`h-72 rounded-2xl animate-pulse ${darkMode ? 'bg-[#0a1e33]' : 'bg-slate-100'}`} />)}
            </div>
          ) : recent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.map(l => <PropertyCard key={l._id} listing={l} darkMode={darkMode} />)}
            </div>
          ) : (
            <div className={`text-center py-16 rounded-2xl border ${darkMode ? 'border-[#112236] text-slate-500' : 'border-slate-100 text-slate-400'}`}>
              <HomeIcon size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">No listings yet. Import the CSV to populate.</p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className={`py-16 ${secBg}`}>
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-12">
            <p className={`text-[10px] font-black uppercase tracking-[3px] mb-2 ${darkMode ? 'text-sky-400' : 'text-[#77B6EA]'}`}>Simple process</p>
            <h2 className={`text-2xl font-black uppercase tracking-tight ${txt}`}>How GharRush Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Search', desc: 'Browse verified listings by city, type, price, and more.', icon: <Search size={18} /> },
              { n: '02', title: 'Connect', desc: 'Talk directly to verified brokers and schedule viewings.', icon: <Users size={18} /> },
              { n: '03', title: 'Move in', desc: 'Complete the deal with full documentation support.', icon: <CheckCircle size={18} /> },
            ].map((s) => (
              <div key={s.n} className={`rounded-2xl p-7 border ${darkMode ? 'bg-[#0a1e33] border-[#112236]' : 'bg-white border-slate-100 shadow-sm'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${darkMode ? 'bg-sky-500/20 text-sky-400' : 'bg-[#0D2A4A]/10 text-[#0D2A4A]'}`}>
                  {s.icon}
                </div>
                <div className={`text-[10px] font-black mb-2 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`}>{s.n}</div>
                <h3 className={`font-black text-sm uppercase mb-2 ${txt}`}>{s.title}</h3>
                <p className={`text-xs leading-relaxed ${muted}`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CITIES
      ══════════════════════════════════════════ */}
      <section className={`py-16 ${bg}`}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-10">
            <p className={`text-[10px] font-black uppercase tracking-[3px] mb-2 ${darkMode ? 'text-sky-400' : 'text-[#77B6EA]'}`}>Locations</p>
            <h2 className={`text-2xl font-black uppercase tracking-tight ${txt}`}>Properties Across Nepal</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CITY_CARDS.map((c) => (
              <button
                key={c.city}
                onClick={() => navigate(`/listings?city=${c.city}`)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
              >
                <img src={c.img} alt={c.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <div className="text-white font-black text-sm uppercase tracking-wider">{c.city}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
      ══════════════════════════════════════════ */}
      <section className={`py-20 px-8 ${secBg}`}>
        <div className="max-w-3xl mx-auto text-center">
          <div className={`rounded-3xl p-14 relative overflow-hidden ${darkMode ? 'bg-[#0a1e33] border border-[#112236]' : 'bg-[#0D2A4A]'} shadow-2xl`}>
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#F26419]/10" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#77B6EA]/10" />
            <div className="relative z-10">
              <p className="text-[#77B6EA] text-[10px] font-black uppercase tracking-[3px] mb-4">For Brokers</p>
              <h2 className="text-3xl font-black text-white tracking-tight mb-4 uppercase">
                Ready to List Your Property?
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Join verified brokers on GharRush and reach thousands of buyers and renters across Nepal.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link to="/create-listing">
                  <button className="bg-[#F26419] hover:bg-[#d4551a] text-white font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all active:scale-95 shadow-lg">
                    List a Property
                  </button>
                </Link>
                <Link to="/listings">
                  <button className="border border-white/20 text-white/80 hover:bg-white/10 font-semibold text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all">
                    Browse Listings
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FILTER MODAL  (matches existing modal style)
      ══════════════════════════════════════════ */}
      {showFilters && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-sm rounded-[20px] shadow-2xl overflow-hidden ${darkMode ? 'bg-[#0a1e33] border border-[#1e3a5f]' : 'bg-white'}`}>

            {/* Header */}
            <div className={`px-5 py-4 border-b flex items-center justify-between ${darkMode ? 'border-[#1e3a5f]' : 'border-slate-100'}`}>
              <div>
                <h2 className={`text-xs font-black uppercase tracking-widest ${txt}`}>Filters</h2>
                {activeFiltersCount > 0 && (
                  <p className="text-[10px] text-[#F26419] font-semibold mt-0.5">{activeFiltersCount} active</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => { setCity(''); setCategory(''); setFace(''); setMinPrice(''); setMaxPrice(''); setMinBed(''); }}
                    className="text-[10px] font-bold text-red-400 hover:text-red-500 uppercase tracking-wider"
                  >
                    Clear all
                  </button>
                )}
                <button onClick={() => setShowFilters(false)} className={`transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-red-500'}`}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className={`p-5 space-y-5 max-h-[65vh] overflow-y-auto ${darkMode ? 'bg-[#0a1e33]' : 'bg-white'}`}>

              {/* Buy / Rent */}
              <div className="space-y-2">
                <label className={`text-[9px] font-black uppercase tracking-widest ${muted}`}>Property Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['sale', 'rent'].map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                      className={`py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider transition-all
                        ${tab === t
                          ? 'bg-[#0D2A4A] text-white border-[#0D2A4A]'
                          : darkMode ? 'border-[#1e3a5f] text-slate-400 hover:border-sky-500/50' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className={`text-[9px] font-black uppercase tracking-widest ${muted}`}>Property Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Residential', 'Commercial', 'Apartment', 'Land'].map((c) => (
                    <button key={c} onClick={() => setCategory(category === c ? '' : c)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-left
                        ${category === c
                          ? 'bg-[#77B6EA]/20 border-[#77B6EA] text-[#0D2A4A] dark:text-sky-300'
                          : darkMode ? 'border-[#1e3a5f] text-slate-400 hover:border-sky-500/50' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className={`text-[9px] font-black uppercase tracking-widest ${muted}`}>City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none text-xs font-medium transition-colors ${darkMode ? 'bg-[#06101c] border-[#1e3a5f] text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
                >
                  <option value="">Any City</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Price — Min + Max dropdowns */}
              <div className="space-y-2">
                <label className={`text-[9px] font-black uppercase tracking-widest ${muted}`}>Price Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className={`text-[9px] font-bold mb-1 ${muted}`}>Min</p>
                    <select
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border outline-none text-xs font-medium ${darkMode ? 'bg-[#06101c] border-[#1e3a5f] text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                      {MIN_PRICES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className={`text-[9px] font-bold mb-1 ${muted}`}>Max</p>
                    <select
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className={`w-full p-2.5 rounded-xl border outline-none text-xs font-medium ${darkMode ? 'bg-[#06101c] border-[#1e3a5f] text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
                    >
                      {MAX_PRICES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Bedrooms */}
              <div className="space-y-2">
                <label className={`text-[9px] font-black uppercase tracking-widest ${muted}`}>Min Bedrooms</label>
                <div className="flex gap-2">
                  {['', '1', '2', '3', '4', '5'].map((n) => (
                    <button key={n} onClick={() => setMinBed(n === minBed ? '' : n)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-black transition-all
                        ${minBed === n
                          ? 'bg-[#0D2A4A] text-white border-[#0D2A4A]'
                          : darkMode ? 'border-[#1e3a5f] text-slate-400 hover:border-sky-500/50' : 'border-slate-200 text-slate-500'
                        }`}
                    >
                      {n === '' ? 'Any' : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Face direction */}
              <div className="space-y-2">
                <label className={`text-[9px] font-black uppercase tracking-widest ${muted}`}>Face Direction</label>
                <select
                  value={face}
                  onChange={(e) => setFace(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none text-xs font-medium ${darkMode ? 'bg-[#06101c] border-[#1e3a5f] text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
                >
                  <option value="">Any Direction</option>
                  {FACES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Sort */}
              <div className="space-y-2">
                <label className={`text-[9px] font-black uppercase tracking-widest ${muted}`}>Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none text-xs font-medium ${darkMode ? 'bg-[#06101c] border-[#1e3a5f] text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
                >
                  <option value="createdAt_desc">Newest First</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className={`p-4 border-t ${darkMode ? 'border-[#1e3a5f] bg-[#06101c]' : 'border-slate-100 bg-white'}`}>
              <button
                onClick={() => { handleSearch(); setShowFilters(false); }}
                className="w-full bg-[#F26419] hover:bg-[#d4551a] text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg"
              >
                Apply Filters & Search
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}