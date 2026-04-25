import React, { useState } from "react";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L, { MarkerCluster } from "leaflet";
import { propertyService } from "../services/apiService";
import { RssIcon } from "lucide-react";

const MapView = () => {
  const [mapCenter, setMapCenter] = useState([27.7172, 85.334]);
  const [zoom, setZoom] = useState(13);

  const [loading, setLoading] = useState(true);

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch featured properties
        const propertiesResponse = await propertyService.getAll({ limit: 100 });
        setProperties(propertiesResponse.data.properties);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(1).replace(/\.0$/, "") + "Cr";
    }
    if (price >= 100000) {
      return (price / 100000).toFixed(1).replace(/\.0$/, "") + "L";
    }
    if (price >= 1000) {
      return (price / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return price;
  };

  return (
    <div className="overflow-hidden h-96 shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* {value?.lat && value?.lng && (
                <Marker position={[value.lat, value.lng]}>
                    <Popup>
                        Selected Location
                        <br />
                        Lat: {value.lat}, Lng: {value.lng}
                    </Popup>
                </Marker>
            )} */}
        {properties
          .filter((p) => p.location)
          .map((prop) => {
            return (
              <Marker
                key={prop._id}
                position={[prop.location.lat, prop.location.lng]}
                icon={L.divIcon({
                  className: "custom-price-marker",
                  html: `
      <div class="bg-red-800 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap">
        Rs. ${formatPrice(prop.price)}
      </div>
    `,
                  iconSize: [60, 24],
                  iconAnchor: [30, 24],
                })}
              >
                <Popup maxWidth={250}>
                  <div className="w-56">
                    {/* Image */}
                    <img
                      src={
                        prop.images?.[0] ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={prop.title}
                      className="w-full h-32 object-cover rounded-md"
                    />

                    {/* Content */}
                    <div className="mt-2 space-y-1">
                      <h3 className="text-sm font-semibold line-clamp-2">
                        {prop.title}
                      </h3>

                      <p className="text-xs text-gray-500">
                        {prop.location.address}
                      </p>

                      <p className="text-sm font-bold text-red-700">
                        Rs. {formatPrice(prop.price)}
                      </p>

                      {/* Button */}
                      <button
                        onClick={() => {
                          window.location.href = `/listings/${prop._id}`;
                        }}
                        className="w-full mt-2 bg-primary text-white text-xs py-1.5 rounded-md hover:bg-primary-dark transition"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
            /* return (
              <Marker
                position={[prop.location.lat, prop.location.lng]}
                icon={L.divIcon({
                  className: "custom-price-marker",
                  html: `
    <div class="bg-red-800 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap">
      Rs. ${formatPrice(prop.price)}
    </div>
  `,
                  iconSize: [60, 24],
                  iconAnchor: [30, 24],
                })}
              >
                <Popup>
                  Selected Location
                  <br />
                  Lat: {prop.location.lat}, Lng: {prop.location.lng}
                </Popup>
              </Marker>
            ); */
          })}
      </MapContainer>
    </div>
  );
};

export default MapView;
