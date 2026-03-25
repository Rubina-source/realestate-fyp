import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, Clock, MapPin } from 'lucide-react';
import PropertyCard from '../components/property/Propertycard';

/* ─── Price options (CSV: 11,000 – 90,000,000) ────────────────────────── */
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
const CATS = ['Residential', 'Commercial', 'Land', 'Apartment'];

/* ─── Small floating dropdown ─────────────────────────────────────────── */
function Pill({ label, active, darkMode, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 h-9 px-4 rounded-full border text-[11px] font-bold transition-all whitespace-nowrap
          ${active || open
            ? darkMode ? 'bg-sky-500/20 border-sky-400 text-sky-300' : 'bg-[#0D2A4A]/10 border-[#0D2A4A] text-[#0D2A4A]'
            : darkMode ? 'bg-[#0a1e33] border-[#112236] text-slate-300 hover:border-[#1e3a5f]' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
      >
        {label}
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute top-11 left-0 z-50 rounded-2xl shadow-2xl border min-w-[240px] p-4
          ${darkMode ? 'bg-[#0a1e33] border-[#1e3a5f]' : 'bg-white border-slate-100'}`}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────────────────────── */
export default function Properties({ darkMode }) {
  const location = useLocation();
  const navigate = useNavigate();

  /* Read URL params into initial filter state */
  const readParams = useCallback(() => {
    const p = new URLSearchParams(location.search);
    return {
      searchTerm: p.get('searchTerm') || '',
      type: p.get('type') || 'all',
      city: p.get('city') || '',
      category: p.get('category') || '',
      face: p.get('face') || '',
      minPrice: p.get('minPrice') || '',
      maxPrice: p.get('maxPrice') || '',
      bedroom: p.get('bedroom') || '',
      sort: p.get('sort') || 'createdAt',
      order: p.get('order') || 'desc',
    };
  }, [location.search]);

  const [f, setF] = useState(readParams);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newestPosted, setNewestPosted] = useState('');

  const set = (key, val) => setF((prev) => ({ ...prev, [key]: val }));

  /* ── Fetch listings when filters change ── */
  useEffect(() => {
    const ctrl = new AbortController();
    const go = async () => {
      setLoading(true);
      try {
        const p = new URLSearchParams();
        Object.entries(f).forEach(([k, v]) => { if (v && v !== 'all' && v !== '0') p.set(k, v); });
        const res = await fetch(`/api/listing/get?${p}`, { signal: ctrl.signal });
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setListings(list);
        // Most recently posted listing
        const found = list.find((l) => l.posted);
        setNewestPosted(found?.posted || '');
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
      setLoading(false);
    };
    const t = setTimeout(go, 300);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [f]);

  /* ── Sync URL when filters change ── */
  useEffect(() => {
    const p = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => { if (v && v !== 'all' && v !== '0') p.set(k, v); });
    navigate(`/listings?${p}`, { replace: true });
  }, [f]); // eslint-disable-line

  const clearAll = () => setF({ searchTerm: '', type: 'all', city: '', category: '', face: '', minPrice: '', maxPrice: '', bedroom: '', sort: 'createdAt', order: 'desc' });

  const activeCount = [f.type !== 'all' && f.type, f.city, f.category, f.face, f.minPrice, f.maxPrice, f.bedroom].filter(Boolean).length;

  /* ── Price label helper ── */
  const priceLabel = () => {
    if (!f.minPrice && !f.maxPrice) return 'Price';
    const fmt = (v) => {
      const n = Number(v);
      if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
      if (n >= 100000) return `${(n / 100000).toFixed(0)}L`;
      return `${(n / 1000).toFixed(0)}K`;
    };
    if (f.minPrice && f.maxPrice) return `${fmt(f.minPrice)} – ${fmt(f.maxPrice)}`;
    if (f.minPrice) return `≥ ${fmt(f.minPrice)}`;
    return `≤ ${fmt(f.maxPrice)}`;
  };

  /* ── Theme ── */
  const bg = darkMode ? 'bg-[#06101c]' : 'bg-[#f7f8fa]';
  const bar = darkMode ? 'bg-[#08192d] border-[#112236]' : 'bg-white border-slate-200';
  const txt = darkMode ? 'text-white' : 'text-[#0D2A4A]';
  const muted = darkMode ? 'text-slate-400' : 'text-slate-500';
  const inp = darkMode ? 'bg-[#0a1e33] border-[#1e3a5f] text-white placeholder-slate-500' : 'bg-slate-100 border-transparent text-slate-700 placeholder-slate-400';
  const selCls = `w-full p-2 rounded-xl border text-xs outline-none font-medium transition-colors ${darkMode ? 'bg-[#06101c] border-[#1e3a5f] text-slate-200 focus:border-sky-500' : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-[#0D2A4A]'}`;
  const labelCls = `block text-[9px] font-black uppercase tracking-widest mb-1.5 ${muted}`;

  return (
    <div className={`min-h-screen ${bg} pt-16 transition-colors duration-300`}>

      {/* ══════════════════════════════════════════
          STICKY FILTER BAR  (Zillow-style)
      ══════════════════════════════════════════ */}
      <div className={`sticky top-16 z-40 border-b ${bar} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-6 py-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">

            {/* Buy / Rent / All tabs */}
            <div className={`flex rounded-full border overflow-hidden text-[11px] shrink-0 ${darkMode ? 'border-[#1e3a5f]' : 'border-slate-200'}`}>
              {[{ l: 'Buy', v: 'sale' }, { l: 'Rent', v: 'rent' }, { l: 'All', v: 'all' }].map((t) => (
                <button
                  key={t.v}
                  onClick={() => set('type', t.v)}
                  className={`px-5 py-2 font-black uppercase tracking-wider transition-all
                    ${f.type === t.v
                      ? 'bg-[#0D2A4A] text-white'
                      : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-[#0D2A4A]'
                    }`}
                >
                  {t.l}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className={`flex items-center gap-2 rounded-full border px-4 py-2 min-w-[200px] max-w-sm flex-1 ${darkMode ? 'bg-[#0a1e33] border-[#112236]' : 'bg-white border-slate-200'}`}>
              <Search size={13} className={muted} />
              <input
                type="text"
                value={f.searchTerm}
                onChange={(e) => set('searchTerm', e.target.value)}
                placeholder="Search suburb, postcode or address..."
                className={`flex-1 outline-none text-[12px] font-medium bg-transparent ${darkMode ? 'text-white placeholder-slate-500' : 'text-slate-700 placeholder-slate-400'}`}
              />
              {f.searchTerm && <button onClick={() => set('searchTerm', '')}><X size={11} className={muted} /></button>}
            </div>

            {/* ── Pill dropdowns ── */}

            {/* City */}
            <Pill label={f.city || 'City'} active={!!f.city} darkMode={darkMode}>
              <label className={labelCls}>Select city</label>
              {['', ...CITIES].map((c) => (
                <button key={c} onClick={() => set('city', c)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors
                    ${f.city === c ? (darkMode ? 'bg-sky-500/20 text-sky-300' : 'bg-[#0D2A4A]/10 text-[#0D2A4A] font-bold') : (darkMode ? 'text-slate-300 hover:bg-[#06101c]' : 'text-slate-600 hover:bg-slate-50')}`}
                >
                  {c || 'Any city'}
                </button>
              ))}
            </Pill>

            {/* Property type */}
            <Pill label={f.category || 'Property Type'} active={!!f.category} darkMode={darkMode}>
              <label className={labelCls}>Property category</label>
              {['', ...CATS].map((c) => (
                <button key={c} onClick={() => set('category', c)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors
                    ${f.category === c ? (darkMode ? 'bg-sky-500/20 text-sky-300' : 'bg-[#0D2A4A]/10 text-[#0D2A4A] font-bold') : (darkMode ? 'text-slate-300 hover:bg-[#06101c]' : 'text-slate-600 hover:bg-slate-50')}`}
                >
                  {c || 'Any type'}
                </button>
              ))}
            </Pill>

            {/* Price dropdown */}
            <Pill label={priceLabel()} active={!!(f.minPrice || f.maxPrice)} darkMode={darkMode}>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>Min price</label>
                  <select value={f.minPrice} onChange={(e) => set('minPrice', e.target.value)} className={selCls}>
                    {MIN_PRICES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Max price</label>
                  <select value={f.maxPrice} onChange={(e) => set('maxPrice', e.target.value)} className={selCls}>
                    {MAX_PRICES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                {(f.minPrice || f.maxPrice) && (
                  <button onClick={() => { set('minPrice', ''); set('maxPrice', ''); }}
                    className="text-[10px] font-bold text-red-400 hover:text-red-500">
                    Clear price
                  </button>
                )}
              </div>
            </Pill>

            {/* More filters */}
            <Pill
              label={<span className="flex items-center gap-1.5"><SlidersHorizontal size={11} /> Filters {activeCount > 0 && <span className="bg-[#F26419] text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">{activeCount}</span>}</span>}
              active={activeCount > 0}
              darkMode={darkMode}
            >
              <div className="space-y-4 min-w-[240px]">
                {/* Bedrooms */}
                <div>
                  <label className={labelCls}>Min bedrooms</label>
                  <div className="flex gap-1.5">
                    {['', '1', '2', '3', '4', '5'].map((n) => (
                      <button key={n} onClick={() => set('bedroom', n === f.bedroom ? '' : n)}
                        className={`flex-1 py-1.5 rounded-lg border text-[10px] font-black transition-all
                          ${f.bedroom === n
                            ? 'bg-[#0D2A4A] text-white border-[#0D2A4A]'
                            : darkMode ? 'border-[#1e3a5f] text-slate-400 hover:border-sky-500/40' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                      >
                        {n === '' ? 'Any' : `${n}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Face */}
                <div>
                  <label className={labelCls}>Face direction</label>
                  <select value={f.face} onChange={(e) => set('face', e.target.value)} className={selCls}>
                    <option value="">Any direction</option>
                    {FACES.map((fc) => <option key={fc} value={fc}>{fc}</option>)}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className={labelCls}>Sort by</label>
                  <select
                    value={`${f.sort}_${f.order}`}
                    onChange={(e) => {
                      const [s, o] = e.target.value.split('_');
                      setF((prev) => ({ ...prev, sort: s, order: o }));
                    }}
                    className={selCls}
                  >
                    <option value="createdAt_desc">Newest First</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                  </select>
                </div>

                <button onClick={clearAll} className="w-full text-[10px] font-black text-red-400 hover:text-red-500 uppercase tracking-wider pt-1">
                  Clear all filters
                </button>
              </div>
            </Pill>

            {/* Clear badge */}
            {activeCount > 0 && (
              <button onClick={clearAll}
                className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all
                  ${darkMode ? 'border-red-500/30 text-red-400 hover:bg-red-950/30' : 'border-red-200 text-red-500 hover:bg-red-50'}`}>
                <X size={10} /> Clear ({activeCount})
              </button>
            )}

          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 py-7">

        {/* ── POSTED DATE BANNER ── */}
        {!loading && listings.length > 0 && newestPosted && (
          <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 mb-5 ${darkMode ? 'bg-sky-500/10 border-sky-500/30 text-sky-300' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
            <Clock size={14} className="shrink-0" />
            <span className="text-xs font-semibold">
              Most recently listed: <strong>{newestPosted}</strong>
            </span>
            <span className={`ml-auto text-[11px] ${muted}`}>{listings.length} listing{listings.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Result count + active pill tags */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className={`text-lg font-black tracking-tight ${txt}`}>
              {loading ? 'Loading...' : `${listings.length} Propert${listings.length !== 1 ? 'ies' : 'y'}`}
              {f.city && !loading && <span className={`text-base font-semibold ml-2 ${darkMode ? 'text-sky-400' : 'text-[#77B6EA]'}`}>in {f.city}</span>}
            </h1>
          </div>

          {/* Active filter pill tags */}
          <div className="flex flex-wrap gap-2">
            {f.type !== 'all' && f.type && (
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full ${darkMode ? 'bg-sky-500/20 text-sky-300' : 'bg-[#0D2A4A]/10 text-[#0D2A4A]'}`}>
                {f.type === 'sale' ? 'Buy' : 'Rent'} <button onClick={() => set('type', 'all')}><X size={9} /></button>
              </span>
            )}
            {f.category && (
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full ${darkMode ? 'bg-sky-500/20 text-sky-300' : 'bg-[#0D2A4A]/10 text-[#0D2A4A]'}`}>
                {f.category} <button onClick={() => set('category', '')}><X size={9} /></button>
              </span>
            )}
            {f.city && (
              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full ${darkMode ? 'bg-sky-500/20 text-sky-300' : 'bg-[#0D2A4A]/10 text-[#0D2A4A]'}`}>
                <MapPin size={9} /> {f.city} <button onClick={() => set('city', '')}><X size={9} /></button>
              </span>
            )}
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`h-72 rounded-2xl animate-pulse ${darkMode ? 'bg-[#0a1e33]' : 'bg-slate-100'}`} />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className={`text-center py-20 rounded-2xl border ${darkMode ? 'border-[#112236] bg-[#0a1e33]' : 'border-slate-100 bg-white'}`}>
            <div className="text-5xl mb-4">🏚️</div>
            <h3 className={`text-base font-black uppercase mb-2 ${txt}`}>No properties found</h3>
            <p className={`text-xs mb-6 ${muted}`}>Try adjusting your filters</p>
            <button onClick={clearAll} className="bg-[#F26419] text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-[#d4551a] transition-all">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <PropertyCard key={item._id} listing={item} darkMode={darkMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}