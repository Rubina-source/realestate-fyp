import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MapPin,
  Home,
  DollarSign,
  User,
  Phone,
  Mail,
  Heart,
  Loader2,
  CheckCircle2,
  Star,
  Fence,
  DoorClosedLocked,
  Dumbbell,
  WavesLadder,
  Wifi,
  Plug,
  Droplet,
  Waves,
  ScrollText,
  WavesArrowUp,
  Bath,
  Bed,
  Car,
  CableCar,
} from "lucide-react";
import {
  inquiryService,
  propertyService,
  favoriteService,
} from "../services/apiService";
import { useAuth } from "../hooks/useAuth";
import InquiryCalendar from "../components/InquiryCalendar";
import toast from "react-hot-toast";
import { priceFormatter } from "../lib/price-formatter";

const getAmenityIcon = (amenity) => {
  const value = (amenity || "").toLowerCase();

  switch (value) {
    case "bathroom":
      return Home;
    case "living room":
      return Home;
    case "terrace":
      return MapPin;
    case "security":
      return User;
    case "price negotiable":
      return DollarSign;
    case "garden":
      return Star;
    case "swimming pool":
      return Waves;
    case "gym":
      return Dumbbell;
    case "lift":
      return MapPin;
    case "water supply":
      return Droplet;
    case "electricity backup":
      return Plug;
    case "internet":
      return Wifi;
    case "kitchen":
      return Home;
    case "balcony":
      return Home;
    case "parking":
      return DollarSign;
    case "cctv":
      return User;
    case "store room":
      return Home;
    case "fencing":
    case "boundary wall":
      return Fence;
    case "gated community":
      return DoorClosedLocked;
    case "electricity":
      return Plug;
    case "lalpurja ready":
      return ScrollText;
    case "drainage":
      return WavesArrowUp;
    case "lift":
      return CableCar;

    default:
      return CheckCircle2;
  }
};

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    preferredMeetingDate: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await propertyService.getById(id);
        setProperty(response.data.property);
        setIsFavorited(response.data.property.isFavorite || false);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        // navigate("/listings");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, user, navigate]);

  const handleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (isFavorited) {
        await favoriteService.remove(property._id);
      } else {
        await favoriteService.add(property._id);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await inquiryService.create({
        propertyId: id,
        ...inquiryData,
      });

      toast.success(response.data.message);
      setShowInquiryForm(false);
      /*  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${property.broker.email}&su=${encodeURIComponent(response.data.message)}&body=${encodeURIComponent(response.data.emailMessage)}`;

      window.open(gmailUrl, "_blank"); */
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-dvh gap-2">
        <Loader2 className="animate-spin" /> <span>Loading...</span>
      </div>
    );
  }

  if (!property) {
    return <div className="text-center py-12">Property not found</div>;
  }

  const typeLabel =
    property.type.charAt(0).toUpperCase() + property.type.slice(1);
  const purposeLabel = property.purpose === "sale" ? "Sale" : "Rent";
  const listedYear = property.createdAt
    ? new Date(property.createdAt).getFullYear()
    : "N/A";
  const sizeText = `${property.size.value.toLocaleString()} ${property.size.unit}`;

  const highlightCards = [
    {
      icon: DollarSign,
      text: priceFormatter(property.price),
    },
    { icon: Home, text: `${typeLabel} property` },
    { icon: ScrollText, text: `Listed in ${listedYear}` },
    { icon: MapPin, text: sizeText },
    {
      icon: DollarSign,
      text: `${property.parking ?? 0} parking space${
        property.parking === 1 ? "" : "s"
      }`,
    },
    { icon: User, text: `${purposeLabel} listing` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="rounded-lg overflow-hidden mb-6">
            <img
              src={property.images[0] || "/placeholder.jpg"}
              alt={property.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Property Details */}
          <div className="p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">{property.title}</h2>
                <div className="flex items-center">
                  <MapPin size={18} className="mr-2" />
                  {property.city?.name || "N/A"},{" "}
                  {property.location?.address || "N/A"}
                </div>
              </div>
              <button
                onClick={handleFavorite}
                className={`p-3 cursor-pointer rounded-full transition ${
                  isFavorited
                    ? "bg-red-500 text-white"
                    : "bg-neutral-200 dark:bg-neutral-700"
                }`}
              >
                <Heart size={24} fill={isFavorited ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 my-6">
              {highlightCards.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-3"
                >
                  {/* <div className="h-8 w-8 shrink-0 rounded border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-200">
                    <Icon size={16} />
                  </div> */}
                  <Icon size={16} />
                  <p className="text-lg text-neutral-800 dark:text-neutral-100 leading-tight">
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-">
              <h2 className="text-2xl font-bold mb-1">Description</h2>
              <p className="leading-relaxed whitespace-pre-wrap text-sm">
                {property.description}
              </p>
            </div>

            {/* Bedrooms, Bathrooms, Parking */}
            {(property.bedrooms || property.bathrooms || property.parking) && (
              <div className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {property.bedrooms && (
                    <div className="flex flex-col p-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Bed size={14} />
                        Bedrooms
                      </span>
                      <span className="text-2xl font-bold">
                        {property.bedrooms}
                      </span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex flex-col p-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Bath size={14} />
                        Bathrooms
                      </span>
                      <span className="text-2xl font-bold">
                        {property.bathrooms}
                      </span>
                    </div>
                  )}
                  {property.parking && (
                    <div className="flex flex-col p-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Car size={14} />
                        Parking
                      </span>
                      <span className="text-2xl font-bold">
                        {property.parking}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="pt-6">
                <h2 className="text-2xl font-bold mb-1">What&apos;s special</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  Key highlights and standout features of this property
                </p>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-md border border-neutral-200 dark:border-neutral-700"
                    >
                      {(() => {
                        const AmenityIcon = getAmenityIcon(amenity);
                        return <AmenityIcon size={14} className="" />;
                      })()}
                      <span className="text-sm font-semibold uppercase tracking-wide">
                        {amenity}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Location on Map</h2>
                        <MapView
                            properties={[property]}
                            center={[property.location.lat, property.location.lng]}
                            zoom={14}
                        />
                    </div> */}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Listed by</h3>

            <div className="flex items-center gap-4">
              {property.broker.profileImage && (
                <img
                  src={property.broker.profileImage}
                  alt={property.broker.name}
                  className="w-20 h-20 rounded-full object-cover mb-4"
                />
              )}

              <div>
                <h4 className="font-bold text-lg mb-1">
                  {property.broker.name}
                </h4>

                {property.broker.company && (
                  <p className="mb-4">{property.broker.company}</p>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {property.broker.phone && (
                <Link
                  to={`tel:${property.broker.phone}`}
                  className="flex items-center"
                >
                  <Phone size={16} className="mr-2" />
                  {property.broker.phone}
                </Link>
              )}
              {property.broker.email && (
                <Link
                  to={`mailto:${property.broker.email}`}
                  className="flex items-center"
                >
                  <Mail size={16} className="mr-2" />
                  {property.broker.email}
                </Link>
              )}
            </div>

            <button
              onClick={() => {
                if (!user) {
                  toast.error("Please login to send an inquiry.");
                  return;
                }
                setShowInquiryForm(true);
              }}
              className="w-full bg-primary text-white cursor-pointer font-bold py-2 rounded hover:opacity-90 transition"
            >
              Send Inquiry
            </button>
          </div>

          {/* Inquiry Form */}
          {showInquiryForm && (
            <div className="bg-white dark:bg-neutral-800 relative rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
              <h3 className="text-lg font-bold mb-4">Booking Inquiry</h3>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <InquiryCalendar
                  propertyId={property._id}
                  onDateSelected={(date) =>
                    setInquiryData({
                      ...inquiryData,
                      preferredMeetingDate: date,
                    })
                  }
                />
                {/* <div>
                                    <label className="block font-semibold mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        value={inquiryData.clientName}
                                        onChange={(e) =>
                                            setInquiryData({ ...inquiryData, clientName: e.target.value })
                                        }
                                        required
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={inquiryData.clientEmail}
                                        onChange={(e) =>
                                            setInquiryData({ ...inquiryData, clientEmail: e.target.value })
                                        }
                                        required
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={inquiryData.clientPhone}
                                        onChange={(e) =>
                                            setInquiryData({ ...inquiryData, clientPhone: e.target.value })
                                        }
                                        required
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div> */}

                <div>
                  <label className="block font-semibold mb-2">Message</label>
                  <textarea
                    value={inquiryData.message}
                    onChange={(e) =>
                      setInquiryData({
                        ...inquiryData,
                        message: e.target.value,
                      })
                    }
                    required
                    rows="4"
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary dark:bg-neutral-700 text-white font-bold py-2 rounded hover:opacity-90 transition disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Inquiry"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
