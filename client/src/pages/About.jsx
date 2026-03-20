import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 pb-20">
      
      {/* --- TOP HEADER SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-6">
          <Home size={14} />
          <Link to="/" className="hover:text-[#1F3E35]">Home</Link>
          <span>/</span>
          <span className="text-slate-800">About</span>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <h1 className="text-5xl md:text-6xl font-serif text-[#1F3E35] leading-tight max-w-2xl">
            Shaping the Future <br /> of Real Estate
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-xs leading-relaxed">
            From luxury villas to modern apartments, explore handpicked properties that match your lifestyle and investment goals.
          </p>
        </div>
      </section>

      {/* --- HERO IMAGE GRID --- */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-24">
        {/* Left Big Image */}
        <div className="lg:col-span-7 h-[500px]">
          <img 
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80" 
            className="w-full h-full object-cover rounded-sm" 
            alt="Team"
          />
        </div>
        
        {/* Right Content Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex gap-4">
            <button className="bg-[#f05a28] text-white px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-orange-700 transition">
              Explore Properties
            </button>
            <button className="border border-slate-300 text-slate-600 px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition">
              Get Consult
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" 
              className="w-full h-full object-cover rounded-sm" 
              alt="Office"
            />
          </div>
        </div>
      </section>

      {/* --- ABOUT US SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        <div className="lg:col-span-7">
          <h2 className="text-4xl font-serif text-[#1F3E35] mb-8">About Us</h2>
          <p className="text-slate-500 text-lg leading-relaxed mb-4">
            We are more than just a real estate agency — we are your trusted partner in finding the perfect property. With years of experience in the <strong>Nepal market</strong>, our team blends local expertise with international standards to deliver exceptional results. 
          </p>
          <p className="text-slate-500 text-lg leading-relaxed mb-6">
            From luxury villas to high-rise apartments, we handpick every listing to match your lifestyle and investment goals.
          </p>
          <button className="text-[#1F3E35] font-black border-b-2 border-[#1F3E35] text-sm uppercase tracking-widest pb-1 hover:text-orange-600 hover:border-orange-600 transition">
            More
          </button>
        </div>

        {/* Happy Families Card */}
        <div className="lg:col-span-5 bg-slate-50 p-10 rounded-sm relative overflow-hidden group">
          <div className="flex -space-x-4 mb-12">
            <img src="https://i.pravatar.cc/100?u=1" className="w-12 h-12 rounded-full border-4 border-white" alt="u1" />
            <img src="https://i.pravatar.cc/100?u=2" className="w-12 h-12 rounded-full border-4 border-white" alt="u2" />
            <img src="https://i.pravatar.cc/100?u=3" className="w-12 h-12 rounded-full border-4 border-white" alt="u3" />
            <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-800 text-white flex items-center justify-center text-xs font-bold">+</div>
          </div>
          <h3 className="text-5xl font-serif text-[#1F3E35] mb-2">300+</h3>
          <p className="text-slate-400 text-sm font-medium">Happy families moved into their dream homes</p>
          <div className="absolute top-10 right-10 opacity-5 group-hover:scale-110 transition duration-1000">
             <Home size={150} />
          </div>
        </div>
      </section>

      {/* --- STATISTICS GRID --- */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
        {/* Testimonial Card */}
        <div className="border border-slate-200 p-10 rounded-sm">
          <div className="flex gap-1 mb-6 text-orange-500">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
          </div>
          <p className="text-slate-600 text-sm italic leading-relaxed mb-8">
            "Working with this team was the best decision I made during my property search. They understood exactly what I wanted and made the process stress-free."
          </p>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden">
                <img src="https://i.pravatar.cc/100?u=fred" alt="" />
             </div>
             <div>
               <h4 className="font-bold text-sm">Frederick Ryan</h4>
               <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Client</p>
             </div>
          </div>
        </div>

        {/* Properties Sold Card */}
        <div className="bg-slate-50 p-10 rounded-sm flex flex-col justify-between">
          <h3 className="text-5xl font-serif text-[#1F3E35]">500+</h3>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Properties sold across the country</p>
        </div>

        {/* Years Experience Card (Dark) */}
        <div className="bg-[#1a1a1a] p-10 rounded-sm text-white flex flex-col justify-between">
          <h3 className="text-5xl font-serif">10+ years</h3>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Trusted market experience</p>
        </div>
      </section>

      {/* --- SIGNATURE PROJECTS SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 border-t pt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h2 className="text-4xl font-serif text-[#1F3E35] mb-4 tracking-tight">Our Signature Projects</h2>
            <p className="text-slate-400 text-sm max-w-md">
              Explore our exclusive developments, each crafted with world-class design, premium locations, and unmatched quality.
            </p>
          </div>
          <button className="border border-orange-200 text-orange-600 px-8 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-orange-50 transition">
            View All Projects
          </button>
        </div>
        <div className="h-[1px] bg-slate-100 w-full"></div>
      </section>

    </div>
  );
};

export default About;