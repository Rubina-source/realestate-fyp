import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/property/PropertyCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function Properties() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        // This fetches from the 2,211 properties in your database
        const res = await fetch(`/api/listing/get?searchTerm=${searchTerm}`);
        const data = await res.json();
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchListings();
  }, [searchTerm]);

  return (
    <div className="flex flex-col md:flex-row pt-24 min-h-screen bg-slate-50">
      {/* Filters Sidebar */}
      <div className="w-full md:w-80 p-8 border-r bg-white h-screen sticky top-0">
        <h2 className="flex items-center gap-2 text-lg font-black text-[#1F3E35] uppercase mb-8">
          <SlidersHorizontal size={20} /> Filters
        </h2>
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Properties</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Title, City..." 
                className="w-full bg-slate-50 p-3 rounded-xl outline-none text-xs border border-transparent focus:border-slate-200"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-3 text-slate-300" size={16} />
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-black text-[#1F3E35] mb-10 uppercase tracking-tighter">
          Verified Homes <span className="text-[#E7C873]">({listings.length})</span>
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {[1,2,3,4].map(i => <div key={i} className="h-80 bg-white rounded-[2rem] animate-pulse shadow-sm"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {listings.map((item) => (
              <PropertyCard key={item._id} listing={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}