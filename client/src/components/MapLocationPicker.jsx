import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

// Component to handle map clicks
const LocationPicker = ({ onLocationSelect }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
      });
    },
  });

  return null;
};

export default function MapLocationPicker({ value, onChange }) {
  const [mapCenter, setMapCenter] = useState([27.7172, 85.334]);
  const [zoom, setZoom] = useState(13);


  const handleLocationSelect = (coords) => {
    onChange(coords);
  };

  return (
    <div className="space-y-4">
      <div>
        {/* Map */}
        <div className="overflow-hidden h-96 shadow-lg">
          <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker onLocationSelect={handleLocationSelect} />
            {value?.lat && value?.lng && (
              <Marker position={[value.lat, value.lng]}>
                <Popup>
                  Selected Location
                  <br />
                  Lat: {value.lat}, Lng: {value.lng}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
