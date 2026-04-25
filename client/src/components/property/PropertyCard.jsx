import { Link } from "react-router-dom";
import {
  Heart,
  MapPin,
  Home as HomeIcon,
  Bed,
  LineSquiggle,
  Minus,
  Bath,
  Car,
} from "lucide-react";
import { useState } from "react";
import { priceFormatter } from "../../lib/price-formatter";

export default function PropertyCard({ property }) {
  const [isFavorited, setIsFavorited] = useState(property.isFavorite || false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    try {
      await favoriteService.add(property._id);
      setIsFavorited(true);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };
  // console.log("@property", property);
  return (
    <Link to={`/listings/${property._id}`}>
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
            className={`absolute cursor-pointer top-3 right-3 p-2 rounded-full transition ${
              isFavorited
                ? "bg-red-500 text-white"
                : "bg-white dark:bg-neutral-800"
            }`}
          >
            <Heart size={20} fill={isFavorited ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h1 className="font-semibold text-lg mb-1 line-clamp-2">
            {property.title}
          </h1>
          <h1 className="font-bold text-lg mb-2 ">
            {priceFormatter(property.price)}
            {property.rentalType && (
              <span>
                {property.rentalType === "daily"
                  ? " /day"
                  : property.rentalType === "monthly"
                    ? " /month"
                    : property.rentalType === "yearly"
                      ? " /year"
                      : ""}
              </span>
            )}
          </h1>

          <div className="flex items-center">
            {property.bedrooms && (
              <>
                <span className="flex items-center gap-0.5">
                  <p className="text-xs font-semibold">{property.bedrooms}</p>
                  <Bed className="text-neutral-700" size={16} />
                </span>
                <Minus className="rotate-90 text-neutral-700" size={18} />
              </>
            )}
            {property.bathrooms && (
              <>
                <span className="flex items-center gap-0.5">
                  <p className="text-xs font-semibold">{property.bathrooms}</p>
                  <Bath className="text-neutral-700" size={16} />
                </span>
                <Minus className="rotate-90 text-neutral-700" size={18} />
              </>
            )}
            {property.parking && (
              <>
                <span className="flex items-center gap-0.5">
                  <p className="text-xs font-semibold">{property.parking}</p>
                  <Car className="text-neutral-700" size={16} />
                </span>
                <Minus className="rotate-90 text-neutral-700" size={18} />
              </>
            )}
            {property.size && (
              <>
                <span className="flex items-center gap-0.5">
                  <p className="text-xs font-semibold">
                    {property.size.value} {property.size.unit}
                  </p>
                </span>
                <Minus className="rotate-90 text-neutral-700" size={18} />
              </>
            )}
            {property.purpose && (
              <>
                <span className="flex items-center">
                  <p className="text-xs font-semibold">
                    {property.purpose === "rent"
                      ? property.type + " for rent"
                      : property.purpose === "sale"
                        ? property.type + " for sale"
                        : ""}
                  </p>
                </span>
              </>
            )}
          </div>

          <div className="flex items-center py-2 text-xs font-semibold">
            {/* <MapPin size={16} className="mr-1" /> */}
            {property.location.address}
          </div>
          {/*  {property.city && (
            <div className="flex items-center  mb-3 text-sm">
              <MapPin size={16} className="mr-1" />
              {property.city.name}
            </div>
          )} */}

          {/* <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-xs font-medium bg-neutral-300 dark:bg-neutral-800 px-3 py-1 rounded-lg">
              <HomeIcon size={14} className="mr-1" />
              {property.size.value} {property.size.unit}
            </div>
          </div> */}
        </div>
      </div>
    </Link>
  );
}
