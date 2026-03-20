import React, { useState } from 'react';
import { Bed, Bath, Maximize, Heart, Search, MapPin } from 'lucide-react';
import { propertyData } from '../data/properties'; // Importing our local dataset

const Listings = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering logic
  const filteredListings = propertyData.filter(item => 
    item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-20">
      {/* Header section */}
      <div className="pt-12 pb-8 text-center">
        <h1 className="text-4xl font-bold text-[#1F3E35] uppercase tracking-tighter">Verified Properties</h1>
        <p className="text-slate-400 text-[10px] font-bold tracking-[3px] uppercase mt-2 opacity-70">
          GharRush Exclusive Listings
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Classy Search Bar */}
        <div className="flex justify-center mb-16">
          <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-full max-w-xl transition-all focus-within:shadow-md">
            <input 
              type="text" 
              placeholder="Search by City or Area (e.g. Kathmandu)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 outline-none text-sm font-medium text-slate-600" 
            />
            <div className="bg-[#1F3E35] text-white p-3 rounded-xl">
              <Search size={18}/>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredListings.length > 0 ? (
            filteredListings.map((item) => (
              <div key={item._id} className="bg-white rounded-[35px] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                <div className="relative h-64 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute top-5 left-5">
                    <span className="bg-[#1F3E35] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">Available</span>
                  </div>
                  <button className="absolute top-5 right-5 p-2.5 bg-white/40 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition">
                    <Heart size={16} />
                  </button>
                </div>

                <div className="p-8">
                  <h3 className="font-bold text-lg text-slate-800 truncate mb-1 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-slate-400 text-[10px] font-bold mb-6 flex items-center gap-1 uppercase tracking-wider">
                    <MapPin size={12} className="text-[#E7C873]" /> {item.address}
                  </p>

                  <div className="flex justify-between items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest border-t border-slate-50 pt-6 mb-6 opacity-80">
                    <div className="flex items-center gap-1.5"><Bed size={14} className="opacity-40"/> {item.bedroom} Bed</div>
                    <div className="flex items-center gap-1.5"><Bath size={14} className="opacity-40"/> {item.bathroom} Bath</div>
                    <div className="flex items-center gap-1.5"><Maximize size={14} className="opacity-40"/> {item.area.split(' ')[0]}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-black text-[#1F3E35]">Rs. {item.price.toLocaleString()}</p>
                    <button className="bg-slate-50 text-[#1F3E35] px-5 py-2.5 rounded-xl text-[10px] font-black hover:bg-[#1F3E35] hover:text-white transition uppercase">View Details</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-slate-400 font-bold uppercase tracking-widest">No properties found in this area.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;