import React, { useState } from 'react';
import { Bed, Bath, Maximize, Heart, Search, MapPin } from 'lucide-react';
import { propertyData } from '../data/properties';

const Listings = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredListings = propertyData.filter(item => 
    item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-20">
      {/* Header section */}
      <div className="pt-16 pb-8 text-center uppercase">
        <h1 className="text-5xl font-extrabold text-[#1F3E35] tracking-tighter">GharRush Listings</h1>
        <p className="text-slate-400 text-[11px] font-black tracking-[4px] mt-3 opacity-60">
          Search. Choose. Move in — your perfect home is just a few clicks away
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Classy Search Bar */}
        <div className="flex justify-center mb-16 px-4">
          <div className="flex bg-white p-2 rounded-[25px] shadow-2xl border border-slate-100 w-full max-w-2xl transition-all focus-within:ring-2 ring-[#E7C873]/20">
            <input 
              type="text" 
              placeholder="Search by location (e.g. Kathmandu, Baluwatar)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-6 py-3 outline-none text-sm font-bold text-slate-600 placeholder:text-slate-300" 
            />
            <div className="bg-[#1F3E35] text-white p-4 rounded-2xl shadow-lg cursor-pointer hover:bg-black transition-all">
              <Search size={22}/>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredListings.length > 0 ? (
            filteredListings.map((item) => (
              <div key={item._id} className="bg-white rounded-[45px] border border-slate-50 overflow-hidden hover:shadow-[0_40px_80px_rgba(0,0,0,0.07)] transition-all duration-700 group relative">
                
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-1000" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-[#1F3E35] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">For Sale</span>
                  </div>
                  <button className="absolute top-6 right-6 p-3 bg-white/40 backdrop-blur-xl rounded-full text-white hover:bg-white hover:text-red-500 transition-all shadow-xl">
                    <Heart size={20} />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-10">
                  <h3 className="font-extrabold text-xl text-slate-800 truncate mb-2 uppercase tracking-tight leading-tight">{item.title}</h3>
                  <p className="text-slate-400 text-[11px] font-bold mb-6 flex items-center gap-2 uppercase tracking-widest italic">
                    <MapPin size={14} className="text-[#E7C873]" /> {item.address}
                  </p>

                  <div className="flex justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-[2px] border-t border-slate-50 pt-8 mb-8 opacity-70">
                    <div className="flex items-center gap-2"><Bed size={16} className="text-[#1F3E35]"/> {item.bedroom} Bed</div>
                    <div className="flex items-center gap-2"><Bath size={16} className="text-[#1F3E35]"/> {item.bathroom} Bath</div>
                    <div className="flex items-center gap-2"><Maximize size={16} className="text-[#1F3E35]"/> {item.area.split(' ')[0]}</div>
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <p className="text-3xl font-black text-[#1F3E35] tracking-tighter">Rs. {(item.price / 10000000).toFixed(1)} Cr</p>
                    <button className="bg-slate-50 text-[#1F3E35] px-6 py-3 rounded-2xl text-[10px] font-black hover:bg-[#1F3E35] hover:text-white transition-all shadow-sm uppercase tracking-widest border border-slate-100">
                        Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-24">
              <p className="text-slate-300 font-black text-xs uppercase tracking-[5px]">No matches found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;