import { Link } from "react-router-dom";
import { Heart, MapPin, Home as HomeIcon } from "lucide-react";
import { useState } from "react";

export default function PropertyCard({ property }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    setIsFavorited(!isFavorited)
  };
  return (
    <Link to={`/listings/${property.id}`}>
      <div className="rounded-xl border border-neutral-300 dark:border-neutral-800 overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={property.images[0] || "/placeholder.jpg"}
            alt={property.title}
            className="w-full h-full object-cover hover:scale-110 transition duration-300"
          />
          <button
            onClick={handleFavorite}
            className={`absolute cursor-pointer top-3 right-3 p-2 rounded-full transition ${isFavorited
              ? "bg-red-500 text-white"
              : "bg-white dark:bg-neutral-800"
              }`}
          >
            <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-base mb-2 line-clamp-2">
            {property.title}
          </h3>

          <div className="flex items-center  mb-3 text-sm">
            <MapPin size={16} className="mr-1" />
            {property.city}, {property.address}
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-orange-400 font-bold text-xl">
              Rs. {property.price.toLocaleString()}
            </span>
            <div className="flex items-center text-xs font-medium bg-neutral-300 dark:bg-neutral-800 px-3 py-1 rounded-lg">
              <HomeIcon size={14} className="mr-1" />
              {property.size.value} {property.size.unit}
            </div>
          </div>

          <p className="text-sm line-clamp-2">
            {property.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
