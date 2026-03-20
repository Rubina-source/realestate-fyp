import React from 'react';
import { Star, ChevronDown, Send } from 'lucide-react';

const Contact = () => {
  const testimonials = [
    { name: "Sneha Shrestha", text: "My wife and I have been dealing with GharRush for over 18 months, and they are outstanding. Co-operative and understanding, as well as very efficient.", img: "https://i.pravatar.cc/150?u=sneha" },
    { name: "Shifaath Shariff", text: "GharRush is a pioneer and trusted company in the Real Estate sector in Nepal and I'm happy to have had their assistance. They provide non-biased advice.", img: "https://i.pravatar.cc/150?u=shif" },
    { name: "Laxmi Tamang", text: "GharRush is a reliable and professional Real Estate Company. We've worked with Ms. Mira Dole and she has assisted my family extensively.", img: "https://i.pravatar.cc/150?u=lax" },
    { name: "Roshan Thapa", text: "GharRush has been one of the most helpful agencies to work with! They manage our properties honestly and they've been remarkable!", img: "https://i.pravatar.cc/150?u=rosh" },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      
      {/* SECTION 1: TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-5xl font-black text-center text-[#1F3E35] uppercase tracking-tighter mb-20">
          Hear What They Say
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side: Creative Image Section */}
          <div className="flex-1 relative">
            <div className="bg-[#fdf8e6] rounded-[60px] p-8 border-4 border-white shadow-2xl overflow-hidden group">
                <img 
                  src="https://www.mindk.com/wp-content/uploads/2021/06/6_Golden_Rules_on_How_to_Build_a_Real_Estate_App_From_Scratch-1.png" 
                  className="w-full h-auto rounded-[40px] shadow-xl transition-transform duration-700 group-hover:scale-105" 
                  alt="Property App"
                />
            </div>
          </div>

          {/* Right Side: Testimonials Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-50 group">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#E7C873] text-[#E7C873]" />
                  ))}
                </div>
                <p className="text-slate-500 text-[11px] font-bold leading-relaxed mb-8 italic opacity-80 uppercase">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <img src={t.img} className="w-12 h-12 rounded-full border-2 border-slate-100 group-hover:border-[#E7C873] transition-colors" alt="" />
                  <h4 className="font-black text-xs text-[#1F3E35] uppercase tracking-wider">{t.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: CONTACT FORM */}
      <section className="bg-[#E7C873] py-24 px-4">
        <div className="max-w-[550px] mx-auto bg-white rounded-[60px] shadow-2xl p-14 transform transition-all hover:scale-[1.01]">
          <h2 className="text-4xl font-black text-[#1F3E35] mb-2 tracking-tighter uppercase">Contact Form</h2>
          <p className="text-slate-400 text-[10px] font-black leading-relaxed mb-12 uppercase tracking-widest opacity-70">
            Please provide the following information to help us better understand your needs.
          </p>

          <form className="space-y-10" autoComplete="off">
            {/* Information Group */}
            <div className="space-y-5">
              <label className="text-[10px] font-black uppercase text-[#1F3E35] tracking-[3px] block ml-2">Your Information</label>
              <input type="text" placeholder="YOUR NAME" className="w-full border-2 border-slate-50 bg-slate-50/30 p-5 rounded-2xl outline-none focus:border-[#E7C873] focus:bg-white transition-all text-xs font-bold tracking-widest placeholder:text-slate-300" />
              <input type="email" placeholder="YOUR EMAIL" className="w-full border-2 border-slate-50 bg-slate-50/30 p-5 rounded-2xl outline-none focus:border-[#E7C873] focus:bg-white transition-all text-xs font-bold tracking-widest placeholder:text-slate-300" />
            </div>

            {/* Preference Group */}
            <div className="space-y-5">
              <label className="text-[10px] font-black uppercase text-[#1F3E35] tracking-[3px] block ml-2">Your Preference</label>
              
              <div className="relative group">
                <select className="w-full appearance-none border-2 border-slate-50 bg-slate-50/30 p-5 rounded-2xl outline-none text-slate-400 text-xs font-bold cursor-pointer uppercase tracking-widest focus:border-[#E7C873] transition-all">
                  <option>type of property are you interested</option>
                  <option>Modern Villa</option>
                  <option>Apartment</option>
                  <option>Land / Plot</option>
                </select>
                <ChevronDown size={18} className="absolute right-5 top-5 text-slate-300 pointer-events-none group-hover:text-[#1F3E35]" />
              </div>

              <div className="relative group">
                <select className="w-full appearance-none border-2 border-slate-50 bg-slate-50/30 p-5 rounded-2xl outline-none text-slate-400 text-xs font-bold cursor-pointer uppercase tracking-widest focus:border-[#E7C873] transition-all">
                  <option>what is your preferred location?</option>
                  <option>Kathmandu</option>
                  <option>Lalitpur</option>
                  <option>Pokhara</option>
                </select>
                <ChevronDown size={18} className="absolute right-5 top-5 text-slate-300 pointer-events-none group-hover:text-[#1F3E35]" />
              </div>

              <div className="relative group">
                <select className="w-full appearance-none border-2 border-slate-50 bg-slate-50/30 p-5 rounded-2xl outline-none text-slate-400 text-xs font-bold cursor-pointer uppercase tracking-widest focus:border-[#E7C873] transition-all">
                  <option>what is your budget?</option>
                  <option>Below Rs. 1 Crore</option>
                  <option>Rs. 1 Crore - 5 Crore</option>
                  <option>Above Rs. 5 Crore</option>
                </select>
                <ChevronDown size={18} className="absolute right-5 top-5 text-slate-300 pointer-events-none group-hover:text-[#1F3E35]" />
              </div>
            </div>

            <button type="button" className="w-full bg-[#1F3E35] text-white py-6 rounded-3xl font-black uppercase tracking-[4px] text-xs shadow-xl hover:bg-black hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3">
              Get Inquiry <Send size={16} />
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

// THIS LINE FIXES THE BLANK SCREEN
export default Contact;