import React, { useEffect, useState } from "react";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/listing/get?limit=24");
        const data = await res.json();
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="pt-32 px-10 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-black text-[#1F3E35] mb-10 uppercase tracking-tighter"></h1>

      {loading && (
        <p className="text-center py-20 text-slate-400 animate-pulse font-bold">
          Loading listings...
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white rounded-[35px] shadow-xl overflow-hidden border border-slate-50 hover:scale-105 transition duration-300"
          >
            <img
              src={listing.imageUrls[0]}
              className="h-52 w-full object-cover"
              alt="house"
            />
            <div className="p-8">
              <h2 className="text-lg font-bold text-[#1F3E35] truncate">
                {listing.title}
              </h2>
              <p className="text-slate-400 text-xs font-bold mt-1 uppercase">
                {listing.city}, {listing.address}
              </p>

              <div className="flex gap-4 mt-4 text-[10px] font-black text-slate-500 uppercase border-y py-3">
                <span>{listing.bedrooms} Bed</span>
                <span>{listing.bathrooms} Bath</span>
                <span>Parking: {listing.parking}</span>
              </div>

              <div className="flex justify-between items-center mt-6">
                <span className="text-2xl font-black text-[#1F3E35]">
                  Rs. {listing.price.toLocaleString()}
                </span>
                <button className="bg-primary text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase hover:bg-primary-dark transition-all">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
