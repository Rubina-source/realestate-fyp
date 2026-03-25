import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize2, Clock, Eye } from 'lucide-react';

/* ─── Format price (Nepali style) ──────────────────────────────────────── */
function fmtPrice(price, type) {
  const n = Number(price);
  if (!n) return 'Price N/A';
  const sfx = type === 'rent' ? '/mo' : '';
  if (n >= 10000000) return `Rs. ${(n / 10000000).toFixed(2)} Cr${sfx}`;
  if (n >= 100000) return `Rs. ${(n / 100000).toFixed(1)} L${sfx}`;
  if (n >= 1000) return `Rs. ${(n / 1000).toFixed(0)}K${sfx}`;
  return `Rs. ${n.toLocaleString()}${sfx}`;
}

/* ─── Fallback images per category ─────────────────────────────────────── */
const IMG = {
  Residential: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=75',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=75',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&q=75',
  ],
  Commercial: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=75',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=75',
  ],
  Land: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=75',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=75',
  ],
  Apartment: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=75',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=75',
  ],
  House: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=75',
  ],
};

function getImg(listing) {
  if (listing.imageUrls?.length) return listing.imageUrls[0];
  const pool = IMG[listing.category] || IMG.Residential;
  const idx = listing._id ? parseInt(listing._id.slice(-2), 16) % pool.length : 0;
  return pool[idx];
}

/* ─── Category badge color ──────────────────────────────────────────────── */
const CAT_TAG = {
  Residential: 'bg-emerald-100 text-emerald-700',
  Commercial: 'bg-orange-100 text-orange-700',
  Land: 'bg-violet-100 text-violet-700',
  Apartment: 'bg-sky-100 text-sky-700',
  House: 'bg-emerald-100 text-emerald-700',
};

export default function PropertyCard({ listing, darkMode }) {
  const { _id, address, city, price, type, category, bedroom, bathroom, area, posted, views, face } = listing;

  return (
    <Link to={`/listing/${_id}`} className="block group">
      <div className={`rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl
        ${darkMode
          ? 'bg-[#0a1e33] border-[#112236] hover:border-[#1e3a5f] hover:shadow-black/40'
          : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-slate-200/80'
        }`}
      >
        {/* ── Image ── */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={getImg(listing)}
            alt={address || 'Property'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { e.target.src = IMG.Residential[0]; }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* ── Price (bottom-left) ── */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-[#0D2A4A] text-white text-sm font-black px-3 py-1.5 rounded-xl shadow-lg">
              {fmtPrice(price, type)}
            </span>
          </div>

          {/* ── Type badge (top-left: Sale / Rent) ── */}
          <div className="absolute top-3 left-3">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow
              ${type === 'rent' ? 'bg-[#F26419] text-white' : 'bg-emerald-500 text-white'}`}>
              {type === 'rent' ? 'Rent' : 'Sale'}
            </span>
          </div>

          {/* ── POSTED DATE (top-right) ── */}
          {posted && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 bg-black/55 text-white text-[9px] font-semibold px-2 py-1 rounded-lg backdrop-blur-sm">
                <Clock size={8} /> {posted}
              </span>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="p-4">
          {/* Tags row */}
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${CAT_TAG[category] || 'bg-slate-100 text-slate-500'}`}>
              {category || 'Property'}
            </span>
            {face && (
              <span className={`text-[9px] font-medium px-2 py-0.5 rounded-md ${darkMode ? 'bg-[#06101c] text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                {face}
              </span>
            )}
          </div>

          {/* Address */}
          <h3 className={`font-bold text-sm leading-snug mb-1 line-clamp-1 ${darkMode ? 'text-white' : 'text-[#0D2A4A]'}`}>
            {address || 'Property Address'}
          </h3>

          {/* City */}
          <div className={`flex items-center gap-1.5 text-xs mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <MapPin size={11} className={darkMode ? 'text-[#77B6EA]' : 'text-[#77B6EA]'} />
            {city || 'Nepal'}
          </div>

          {/* Specs */}
          <div className={`flex items-center gap-4 pt-3 border-t flex-wrap text-xs
            ${darkMode ? 'border-[#112236] text-slate-400' : 'border-slate-100 text-slate-500'}`}
          >
            {bedroom > 0 && (
              <span className="flex items-center gap-1">
                <Bed size={11} className={darkMode ? 'text-[#77B6EA]' : 'text-[#77B6EA]'} />
                {bedroom} Bed
              </span>
            )}
            {bathroom > 0 && (
              <span className="flex items-center gap-1">
                <Bath size={11} className={darkMode ? 'text-[#77B6EA]' : 'text-[#77B6EA]'} />
                {bathroom} Bath
              </span>
            )}
            {area && (
              <span className="flex items-center gap-1">
                <Maximize2 size={10} className={darkMode ? 'text-[#77B6EA]' : 'text-[#77B6EA]'} />
                {area}
              </span>
            )}
            {views > 0 && (
              <span className="flex items-center gap-1 ml-auto">
                <Eye size={10} /> {views}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}