import React from 'react';
import { Link } from 'react-router-dom';
import { MoveRight, Building2, Users, CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <div className='pt-32 pb-20 px-4 min-h-screen bg-white'>
      <div className='max-w-7xl mx-auto'>

        {/* --- MAIN HERO SECTION --- */}
        <div className='flex flex-col lg:flex-row gap-12 items-center mb-20'>
          <div className='flex-1 space-y-6'>
            <h1 className='text-5xl md:text-6xl font-black text-[#1F3E35] leading-[1.1] uppercase tracking-tighter'>
              Shaping the Future <br /> of Real Estate
            </h1>
            <div className='flex flex-col md:flex-row gap-8 items-start md:items-center'>
              <p className='text-slate-500 max-w-md text-sm leading-relaxed font-medium'>
                From luxury villas to modern apartments, explore handpicked properties
                that match your lifestyle and investment goals in Nepal's growing market.
              </p>
              <div className='flex gap-4'>
                {/* FIXED LINK TO LISTINGS */}
                <Link to="/listings">
                  <button className='bg-primary text-white px-8 py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg flex items-center gap-2 group'>
                    Explore Properties <MoveRight size={16} className='group-hover:translate-x-1 transition-transform' />
                  </button>
                </Link>
                <button className='border border-slate-200 text-[#1F3E35] px-8 py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all'>
                  Get Consult
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- IMAGE GRID SECTION --- */}
        <div className='grid grid-cols-1 md:grid-cols-12 gap-6 mb-24'>
          <div className='md:col-span-7 h-[400px]'>
            <img
              src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
              className='w-full h-full object-cover rounded-[3rem] shadow-xl'
              alt="Office"
            />
          </div>
          <div className='md:col-span-5 h-[400px]'>
            <img
              src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
              className='w-full h-full object-cover rounded-[3rem] shadow-xl'
              alt="Interior"
            />
          </div>
        </div>

        {/* --- WHY CHOOSE US (To replace the deleted section) --- */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-slate-100 pt-20'>
          <div className='space-y-4'>
            <div className='bg-[#E0F2F1] w-12 h-12 rounded-2xl flex items-center justify-center text-[#1F3E35]'>
              <Building2 size={24} />
            </div>
            <h3 className='text-lg font-black text-[#1F3E35] uppercase'>Premium Selection</h3>
            <p className='text-slate-500 text-sm leading-relaxed'>We only list properties that meet our strict 50-point quality check, ensuring safety and value.</p>
          </div>

          <div className='space-y-4'>
            <div className='bg-[#FFF8E1] w-12 h-12 rounded-2xl flex items-center justify-center text-[#E7C873]'>
              <Users size={24} />
            </div>
            <h3 className='text-lg font-black text-[#1F3E35] uppercase'>Expert Brokers</h3>
            <p className='text-slate-500 text-sm leading-relaxed'>Connect with verified local experts who understand the nuances of the Nepali real estate market.</p>
          </div>

          <div className='space-y-4'>
            <div className='bg-[#FBE9E7] w-12 h-12 rounded-2xl flex items-center justify-center text-[#FF5A3C]'>
              <CheckCircle2 size={24} />
            </div>
            <h3 className='text-lg font-black text-[#1F3E35] uppercase'>Transparent Deals</h3>
            <p className='text-slate-500 text-sm leading-relaxed'>No hidden fees. Every document and legal requirement is handled with total transparency.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;