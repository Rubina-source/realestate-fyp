import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Home as HomeIcon, Building, Hotel, Warehouse, MoveRight } from 'lucide-react';
import PropertyCard from '../components/property/PropertyCard';

const Home = () => {
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from your MongoDB instead of the deleted file
  useEffect(() => {
    const fetchRecentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?limit=3'); // Get top 3 properties
        const data = await res.json();
        setRecentListings(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchRecentListings();
  }, []);

  const categories = [
    { name: 'Apartments', icon: <Building size={20} /> },
    { name: 'Villas', icon: <HomeIcon size={20} /> },
    { name: 'Commercial', icon: <Warehouse size={20} /> },
    { name: 'Plots', icon: <Hotel size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Modern Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg" 
            className="w-full h-full object-cover brightness-50" 
            alt="Hero" 
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span className="bg-[#E7C873] text-[#1F3E35] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[4px] mb-6 inline-block">
            Let us guide your home
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8">
            Find Your Perfect <span className="text-[#E7C873]">Home</span>
          </h1>
          
          {/* Main Search Bar */}
          <div className="bg-white p-2 rounded-full shadow-2xl flex items-center max-w-2xl mx-auto">
            <div className="flex-1 px-6">
              <input 
                type="text" 
                placeholder="Enter City, Neighborhood..." 
                className="w-full outline-none text-sm text-slate-600 font-medium"
              />
            </div>
            <Link to="/listings">
              <button className="bg-[#E7C873] p-4 rounded-full hover:bg-[#1F3E35] hover:text-white transition-all shadow-lg">
                <Search size={24} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <section className="py-20 max-w-7xl mx-auto px-8">
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#E7C873] transition-all cursor-pointer group">
              <div className="text-[#1F3E35] group-hover:text-[#E7C873]">{cat.icon}</div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-600">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURED PROPERTIES (REAL DATA) --- */}
      <section className="py-20 bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-[#1F3E35] uppercase tracking-tighter">Recent Listings</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[2px] mt-2">Newest properties in Nepal</p>
            </div>
            <Link to="/listings" className="flex items-center gap-2 text-[#E7C873] font-black text-xs uppercase underline decoration-2 underline-offset-8">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-slate-200 animate-pulse rounded-[3rem]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {recentListings.length > 0 ? (
                recentListings.map((listing) => (
                  <PropertyCard key={listing._id} listing={listing} />
                ))
              ) : (
                <p className="col-span-3 text-center text-slate-400">No properties available. Please run the import script.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-8">
        <div className="max-w-5xl mx-auto bg-[#1F3E35] rounded-[4rem] p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E7C873] opacity-10 rounded-full -mr-32 -mt-32"></div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-6 relative z-10">
            Ready to list your <span className="text-[#E7C873]">Property</span>?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            Join thousands of brokers in Nepal and get your properties verified and sold faster with GharRush.
          </p>
          <Link to="/create-listing">
            <button className="bg-[#E7C873] text-[#1F3E35] px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-xl active:scale-95">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;