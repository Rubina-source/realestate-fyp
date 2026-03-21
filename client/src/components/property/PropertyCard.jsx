import { MapPin, Heart, MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PropertyCard({ listing }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden group hover:shadow-xl transition-all duration-500">
      <div className="relative overflow-hidden">
        <img 
          src={listing.imageUrls[0]} 
          alt="property" 
          className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-[#1F3E35]">
          {listing.type}
        </div>
        <button className="absolute top-5 right-5 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors">
          <Heart size={18} />
        </button>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-black text-[#1F3E35] dark:text-white truncate uppercase tracking-tighter">
            {listing.title}
          </h2>
        </div>
        
        <p className="flex items-center gap-1 text-slate-400 text-xs font-bold mb-4 uppercase">
          <MapPin size={14} className="text-[#E7C873]" /> {listing.city}, {listing.address}
        </p>

        <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-50 dark:border-slate-800 my-4">
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Area</p>
            <p className="text-xs font-black text-slate-700 dark:text-slate-200">{listing.area}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Face</p>
            <p className="text-xs font-black text-slate-700 dark:text-slate-200">{listing.face}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Road</p>
            <p className="text-xs font-black text-slate-700 dark:text-slate-200">{listing.road}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</p>
            <p className="text-2xl font-black text-[#1F3E35] dark:text-[#E7C873]">Rs. {listing.price.toLocaleString()}</p>
          </div>
          <Link to={`/listing/${listing._id}`}>
            <button className="bg-[#1F3E35] text-white p-4 rounded-2xl hover:bg-black transition-all group/btn">
              <MoveRight className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}