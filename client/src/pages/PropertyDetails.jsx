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

export default function PropertyCard({ }) {

    return <div>
        Propery Details Page
    </div>
}