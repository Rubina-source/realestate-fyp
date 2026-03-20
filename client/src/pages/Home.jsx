import React from 'react';
import { Search, ArrowRight, Home as HomeIcon, Building, Hotel, Warehouse, Bed, Bath, Maximize, Heart, CheckCircle, Quote } from 'lucide-react';
import { propertyData } from '../data/properties';

const Home = () => {
  const categories = [
    { name: "Modern Villa", count: 10, icon: <HomeIcon /> },
    { name: "Apartment", count: 3, icon: <Building /> },
    { name: "Office", count: 3, icon: <Warehouse /> },
    { name: "Single Family", count: 5, icon: <Hotel /> },
  ];

  const locations = [
    { name: "Kathmandu", count: 8 }, { name: "Butwal", count: 0 }, { name: "Chitwan", count: 0 },
    { name: "Pokhara", count: 2 }, { name: "Lalitpur", count: 1 }, { name: "Kirtipur", count: 0 },
    { name: "Bhaktapur", count: 3 }, { name: "Budhanilkantha", count: 2 }, { name: "Jhapa", count: 0 }
  ];

  return (
    <div className="font-sans text-slate-900 bg-[#fcfcfc]">
      
      {/* HERO SECTION WITH REQUESTED PHOTO */}
      <section className="relative pt-32 pb-40 px-4 border-b overflow-hidden min-h-[80vh] flex items-center justify-center">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D" 
            className="w-full h-full object-cover" 
            alt="Modern Luxury Villa" 
          />
          {/* Subtle overlay to help text readability */}
          <div className="absolute inset-0 bg-white/20"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block px-5 py-1 border border-slate-300 rounded-full text-[10px] font-black text-slate-500 mb-6 bg-white/80 backdrop-blur-sm tracking-[2px] uppercase">
            Let us guide your home
          </div>
          <p className="text-[#1F3E35] text-sm font-bold mb-2">We've more than 745,000 apartments, place & plot.</p>
          <h1 className="text-6xl md:text-8xl font-extrabold text-[#1F3E35] mb-12 tracking-tighter">Find Your Perfect Home</h1>

          <div className="bg-white p-2 rounded-full shadow-2xl flex items-center max-w-2xl mx-auto border border-slate-100 overflow-hidden mb-10">
            <input type="text" placeholder="Enter Name, Keywords..." className="flex-1 px-8 py-4 outline-none text-slate-700 text-lg bg-transparent" />
            <button className="bg-[#E7C873] p-5 rounded-full hover:bg-yellow-500 transition shadow-lg">
              <Search className="text-[#1F3E35]" size={28} />
            </button>
          </div>

          <div className="flex justify-center gap-10 font-black text-xs uppercase tracking-widest">
            <button className="text-[#1F3E35] border-b-2 border-[#1F3E35] pb-1">All Properties</button>
            <button className="text-slate-400 hover:text-[#1F3E35] transition">For Sale</button>
            <button className="text-slate-400 hover:text-[#1F3E35] transition">For Rent</button>
          </div>
        </div>
      </section>

      {/* 1-2-3 STEPS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-[#1F3E35] mb-4 tracking-tight">Find Your Dream House as Easy as 1,2,3</h2>
          <p className="text-slate-400 mb-16 text-lg font-bold italic tracking-tight opacity-80">
            "Search. Choose. Move in — your perfect home is just a few clicks away"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { id: 1, title: "Search for your favorite house in your location", icon: "🏠" },
              { id: 2, title: "Make a visit appointment with one of our agents", icon: "📅" },
              { id: 3, title: "Get your dream house in a month, or less", icon: "🎉" }
            ].map(step => (
              <div key={step.id} className="flex flex-col items-center group">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner group-hover:bg-[#E7C873]/10 transition">{step.icon}</div>
                <h3 className="font-extrabold text-xl mb-4 max-w-[250px] text-slate-700">{step.id}. {step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="py-24 bg-[#fcfcfc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#1F3E35] mb-4 uppercase">Featured Categories</h2>
            <p className="text-slate-400 text-sm font-bold opacity-70 italic tracking-tight">From villas to offices — we’ve got your space.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <div key={i} className="bg-white p-10 rounded-[35px] border border-slate-100 text-center hover:shadow-2xl transition group cursor-pointer">
                <div className="w-16 h-16 bg-slate-50 text-[#1F3E35] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#E7C873] group-hover:text-white transition">
                  {cat.icon}
                </div>
                <h4 className="font-extrabold text-lg text-slate-700">{cat.name}</h4>
                <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">{cat.count} Properties</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT PROPERTIES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#1F3E35] mb-4 tracking-tight uppercase">Recent Properties for Rent</h2>
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Latest hand-picked units</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {propertyData.slice(0, 4).map((item) => (
              <div key={item._id} className="bg-white rounded-[40px] border border-slate-100 overflow-hidden hover:shadow-2xl transition group">
                <div className="relative h-64">
                    <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <span className="absolute top-5 left-5 bg-[#1F3E35] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Available</span>
                    <button className="absolute top-5 right-5 p-2 bg-white/40 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition"><Heart size={18}/></button>
                </div>
                <div className="p-8">
                    <h3 className="font-extrabold text-lg truncate mb-1 text-slate-700 uppercase tracking-tighter">{item.title}</h3>
                    <p className="text-slate-400 text-xs font-bold mb-5 flex items-center gap-1 opacity-70 italic">📍 {item.address}</p>
                    <div className="flex justify-between items-center text-slate-500 text-[10px] font-black uppercase tracking-widest border-t pt-5 mb-5 opacity-60">
                        <div className="flex items-center gap-1"><Bed size={14}/> {item.bedroom}</div>
                        <div className="flex items-center gap-1"><Bath size={14}/> {item.bathroom}</div>
                        <div className="flex items-center gap-1"><Maximize size={14}/> {item.area.split(' ')[0]}</div>
                    </div>
                    <p className="text-2xl font-black text-[#1F3E35]">Rs. {(item.price/10000000).toFixed(1)} Cr</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-[#FFF8F3]">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative">
                  <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" className="rounded-[40px] shadow-2xl relative z-10 w-4/5 ml-auto border-8 border-white" alt="" />
                  <div className="absolute -bottom-10 left-0 w-3/5 bg-[#E7C873] p-10 rounded-[40px] shadow-2xl z-20">
                      <div className="text-[#1F3E35] mb-2"><HomeIcon size={40}/></div>
                      <h4 className="font-black text-2xl text-[#1F3E35] uppercase tracking-tighter">Properties For Sale</h4>
                      <p className="text-5xl font-black text-[#1F3E35]">14K+</p>
                  </div>
              </div>
              <div>
                  <h2 className="text-6xl font-extrabold text-[#1F3E35] mb-6 leading-[0.9] tracking-tighter uppercase">Why Choose Us</h2>
                  <p className="text-slate-500 mb-10 text-xl font-bold leading-snug italic opacity-80 uppercase tracking-tight">
                    "Hot spots, top picks, and why we’re your go-to — all in one place."
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {["100% Secure", "Wide Range of Properties", "Buy or Rent Homes", "Trusted by Thousands"].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 font-black text-xs uppercase tracking-widest text-[#1F3E35]">
                              <CheckCircle className="text-green-600" size={18}/> {item}
                          </div>
                      ))}
                  </div>
                  <button className="mt-12 bg-[#1F3E35] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-black transition-all">Learn More <ArrowRight className="inline ml-2" size={20}/></button>
              </div>
          </div>
      </section>

      {/* PROPERTIES BY AREA */}
      <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
              <h2 className="text-5xl font-extrabold text-[#1F3E35] mb-20 tracking-tighter uppercase">Properties by Area</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {locations.map((loc, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 rounded-[30px] border border-transparent hover:border-slate-100 hover:bg-slate-50 transition cursor-pointer group">
                          <div className="w-20 h-20 bg-slate-200 rounded-[22px] overflow-hidden shadow-xl border-4 border-white">
                              <img src={`https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=100&q=80`} alt="" className="w-full h-full object-cover group-hover:scale-125 transition duration-500" />
                          </div>
                          <div className="text-left">
                              <h4 className="font-black text-xl text-slate-700 group-hover:text-[#1F3E35] transition tracking-tight uppercase">{loc.name}</h4>
                              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{loc.count} Properties</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#121212] pt-24 pb-8 text-white">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center border-b border-white/5 pb-20 mb-10">
              <h1 className="text-4xl font-black tracking-tighter uppercase">Ghar<span className="text-[#E7C873]">Rush</span></h1>
              <div className="flex gap-10 opacity-60 text-xs font-bold uppercase tracking-widest">
                <span className="hover:text-[#E7C873] cursor-pointer transition">Facebook</span>
                <span className="hover:text-[#E7C873] cursor-pointer transition">Twitter</span>
                <span className="hover:text-[#E7C873] cursor-pointer transition">Instagram</span>
              </div>
          </div>
          <div className="text-center text-slate-600 text-[10px] font-black uppercase tracking-[4px]">
              <p>Copyright © 2025. GharRush - Rubina Chhahari</p>
          </div>
      </footer>

    </div>
  );
};

export default Home;