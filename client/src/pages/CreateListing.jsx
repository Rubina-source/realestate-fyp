import React, { useState } from 'react';
import { Camera, MapPin, Home, Info, CheckCircle } from 'lucide-react';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    price: '',
    bedroom: 1,
    bathroom: 1,
    parking: 0,
    type: 'sale',
    amenities: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Property Submitted for Verification! (Demo Mode)");
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Form Header */}
        <div className="bg-[#1F3E35] p-10 text-center">
          <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Add New Property</h1>
          <p className="text-slate-300 text-xs font-bold tracking-[3px] uppercase mt-2">List your space on GharRush</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8" autoComplete="off">
          
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-[#1F3E35] font-bold uppercase text-sm tracking-widest border-b pb-2">
              <Info size={18} /> Basic Information
            </h2>
            <input 
              type="text" placeholder="PROPERTY TITLE (e.g. Modern 3BHK Villa)" 
              className="w-full bg-slate-50 p-4 rounded-2xl outline-none border border-transparent focus:border-slate-200 transition text-xs font-medium" required 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="ADDRESS" className="bg-slate-50 p-4 rounded-2xl outline-none border border-transparent focus:border-slate-200 transition text-xs font-medium" required />
              <input type="number" placeholder="PRICE (Rs.)" className="bg-slate-50 p-4 rounded-2xl outline-none border border-transparent focus:border-slate-200 transition text-xs font-medium" required />
            </div>
          </div>

          {/* Section 2: Details */}
          <div className="space-y-4 pt-4">
            <h2 className="flex items-center gap-2 text-[#1F3E35] font-bold uppercase text-sm tracking-widest border-b pb-2">
              <Home size={18} /> Property Details
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Bedrooms</label>
                <input type="number" defaultValue="1" className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Bathrooms</label>
                <input type="number" defaultValue="1" className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Parking</label>
                <input type="number" defaultValue="0" className="w-full bg-slate-50 p-4 rounded-2xl outline-none text-xs font-bold" />
              </div>
            </div>
          </div>

          {/* Section 3: Image Upload Placeholder */}
          <div className="space-y-4 pt-4">
            <h2 className="flex items-center gap-2 text-[#1F3E35] font-bold uppercase text-sm tracking-widest border-b pb-2">
              <Camera size={18} /> Property Media
            </h2>
            <div className="border-2 border-dashed border-slate-100 rounded-[30px] p-12 text-center group hover:border-[#E7C873] transition-all cursor-pointer bg-slate-50/50">
              <Camera className="mx-auto text-slate-300 group-hover:text-[#E7C873] mb-2" size={40} />
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Click to upload property photos</p>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-[#1F3E35] text-white py-5 rounded-2xl font-bold shadow-lg hover:bg-black hover:shadow-2xl transition-all active:scale-95 text-xs uppercase tracking-[4px] mt-8">
            Submit Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;