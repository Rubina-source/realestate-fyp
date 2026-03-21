import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Bed, Bath, Layers, Navigation, Phone, Heart } from 'lucide-react';

export default function PropertyDetails() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setErrorOccurred(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (err) {
        setErrorOccurred(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  if (loading) return <div className='pt-40 text-center animate-pulse font-black text-[#1F3E35]'>FETCHING DATA...</div>;
  if (errorOccurred) return <div className='pt-40 text-center text-red-500 font-bold'>ERROR: Property not found!</div>;

  return (
    <main className="pt-28 min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <img src={listing.imageUrls[0]} className="w-full h-[500px] object-cover rounded-4xl shadow-2xl" alt="main" />
          <div className="mt-8 bg-white p-10 rounded-4xl shadow-sm border border-slate-100">
            <div className='flex justify-between items-start mb-6'>
                <h1 className="text-3xl font-black text-[#1F3E35] uppercase tracking-tighter">{listing.title}</h1>
                <p className="text-3xl font-black text-[#1F3E35]">Rs. {listing.price.toLocaleString()}</p>
            </div>
            <p className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs mb-10 tracking-[2px]">
                <MapPin size={16} className="text-[#E7C873]" /> {listing.city}, {listing.address}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-slate-50 mb-8">
                <div className='text-center'><p className='text-xs font-black text-[#1F3E35]'>{listing.face}</p><p className='text-[10px] text-slate-400 uppercase font-bold'>Face</p></div>
                <div className='text-center'><p className='text-xs font-black text-[#1F3E35]'>{listing.road}</p><p className='text-[10px] text-slate-400 uppercase font-bold'>Road</p></div>
                <div className='text-center'><p className='text-xs font-black text-[#1F3E35]'>{listing.bedroom}</p><p className='text-[10px] text-slate-400 uppercase font-bold'>Beds</p></div>
                <div className='text-center'><p className='text-xs font-black text-[#1F3E35]'>{listing.area}</p><p className='text-[10px] text-slate-400 uppercase font-bold'>Area</p></div>
            </div>
            <p className='text-slate-600 leading-relaxed text-sm'>{listing.description}</p>
          </div>
        </div>
        <div className="w-full lg:w-80">
           <div className='bg-[#1F3E35] p-10 rounded-4xl shadow-2xl text-white sticky top-32 text-center'>
              <button className='w-full bg-[#E7C873] text-[#1F3E35] py-4 rounded-2xl font-black uppercase text-xs hover:bg-white transition-all'>Book a Viewing</button>
           </div>
        </div>
      </div>
    </main>
  );
}