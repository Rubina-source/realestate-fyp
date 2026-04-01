import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Home, DollarSign, User, Phone, Mail, Heart } from 'lucide-react';
import { propertyService } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

export default function ListingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [showInquiryForm, setShowInquiryForm] = useState(false);
    const [inquiryData, setInquiryData] = useState({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        message: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await propertyService.getById(id);
                setProperty(response.data.property);

            } catch (error) {
                console.error('Failed to fetch property:', error);
                navigate('/listings');
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id, user, navigate]);

    /* const handleFavorite = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            if (isFavorited) {
                await favoriteService.remove(id);
            } else {
                await favoriteService.add(id);
            }
            setIsFavorited(!isFavorited);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    }; */

    /*  const handleInquirySubmit = async (e) => {
         e.preventDefault();
         setSubmitting(true);
 
         try {
             await inquiryService.create({
                 propertyId: id,
                 ...inquiryData,
             });
 
             alert('Inquiry sent successfully!');
             setInquiryData({ clientName: '', clientEmail: '', clientPhone: '', message: '' });
             setShowInquiryForm(false);
         } catch (error) {
             console.error('Failed to submit inquiry:', error);
             alert('Failed to send inquiry');
         } finally {
             setSubmitting(false);
         }
     }; */

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!property) {
        return <div className="text-center py-12">Property not found</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Image Gallery */}
                    <div className="rounded-lg overflow-hidden mb-6">
                        <img
                            src={property.images[0] || '/placeholder.jpg'}
                            alt={property.title}
                            className="w-full h-96 object-cover"
                        />
                    </div>

                    {/* Property Details */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    {property.title}
                                </h1>
                                <div className="flex items-center">
                                    <MapPin size={18} className="mr-2" />
                                    {property.city.name}, {property.location.address}
                                </div>
                            </div>
                            <button
                                // onClick={handleFavorite}
                                className={`p-3 rounded-full transition ${isFavorited
                                    ? 'bg-red-500 text-white'
                                    : 'bg-neutral-200 dark:bg-neutral-700'
                                    }`}
                            >
                                <Heart size={24} fill={isFavorited ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                            <div className="bg-neutral-100 dark:bg-neutral-700 p-4 rounded">
                                <div className="text-sm">Price</div>
                                <div className="text-xl font-bold text-primary">
                                    Rs. {property.price.toLocaleString()}
                                    {
                                        property.rentalType === 'daily' ? '/day' :
                                            property.rentalType === 'monthly' ? '/month' :
                                                property.rentalType === 'yearly' ? '/year' : ''
                                    }
                                </div>
                            </div>
                            <div className="bg-neutral-100 dark:bg-neutral-700 p-4 rounded">
                                <div className="text-sm">Type</div>
                                <div className="text-xl font-bold">
                                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                                </div>
                            </div>
                            <div className="bg-neutral-100 dark:bg-neutral-700 p-4 rounded">
                                <div className="text-sm">Purpose</div>
                                <div className="text-xl font-bold">
                                    {property.purpose === 'sale' ? 'Sale' : 'Rent'}
                                </div>
                            </div>
                            <div className="bg-neutral-100 dark:bg-neutral-700 p-4 rounded">
                                <div className="text-sm">Size</div>
                                <div className="text-xl font-bold">
                                    {property.size.value} {property.size.unit}
                                </div>
                            </div>
                        </div>

                        {/* Additional Property Details */}
                        {property.rentalType && (
                            <div className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                <div className="text-sm text-blue-600 dark:text-blue-400">Rental Type</div>
                                <div className="text-xl font-bold text-blue-900 dark:text-blue-200 capitalize">
                                    {property.rentalType}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-neutral-300 dark:border-neutral-600 pt-6">
                            <h2 className="text-2xl font-bold mb-4">Description</h2>
                            <p className="leading-relaxed whitespace-pre-wrap">
                                {property.description}
                            </p>
                        </div>

                        {/* Bedrooms, Bathrooms, Parking */}
                        {(property.bedrooms || property.bathrooms || property.parking) && (
                            <div className="border-t border-neutral-300 dark:border-neutral-600 pt-6 mt-6 mb-6">
                                <h2 className="text-2xl font-bold mb-4">Features</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
                                    {property.bedrooms && (
                                        <div className="flex flex-col p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                                Bedrooms
                                            </span>
                                            <span className="text-blue-900 dark:text-blue-200 text-2xl font-bold">
                                                {property.bedrooms}
                                            </span>
                                        </div>
                                    )}
                                    {property.bathrooms && (
                                        <div className="flex flex-col p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                                Bathrooms
                                            </span>
                                            <span className="text-blue-900 dark:text-blue-200 text-2xl font-bold">
                                                {property.bathrooms}
                                            </span>
                                        </div>
                                    )}
                                    {property.parking && (
                                        <div className="flex flex-col p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                                Parking
                                            </span>
                                            <span className="text-blue-900 dark:text-blue-200 text-2xl font-bold">
                                                {property.parking}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Amenities */}
                        {property.amenities && property.amenities.length > 0 && (
                            <div className="border-t border-neutral-300 dark:border-neutral-600 pt-6">
                                <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {property.amenities.map((amenity) => (
                                        <div
                                            key={amenity}
                                            className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                                        >
                                            <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                                            <span className="font-medium">
                                                {amenity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Map */}
                    {/* <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Location on Map</h2>
                        <MapView
                            properties={[property]}
                            center={[property.location.lat, property.location.lng]}
                            zoom={14}
                        />
                    </div> */}
                </div>

                {/* Sidebar - Broker Info & Inquiry */}
                <div className="lg:col-span-1">
                    {/* Broker Card */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-xl font-bold mb-4">Listed by</h3>

                        {property.broker.profileImage && (
                            <img
                                src={property.broker.profileImage}
                                alt={property.broker.name}
                                className="w-20 h-20 rounded-full object-cover mb-4"
                            />
                        )}

                        <h4 className="font-bold text-lg mb-1">
                            {property.broker.name}
                        </h4>

                        {property.broker.company && (
                            <p className="mb-4">{property.broker.company}</p>
                        )}

                        <div className="space-y-2 mb-6">
                            {property.broker.phone && (
                                <div className="flex items-center">
                                    <Phone size={18} className="mr-2" />
                                    {property.broker.phone}
                                </div>
                            )}
                            {property.broker.email && (
                                <div className="flex items-center">
                                    <Mail size={18} className="mr-2" />
                                    {property.broker.email}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setShowInquiryForm(!showInquiryForm)}
                            className="w-full bg-secondary text-primary font-bold py-2 rounded hover:opacity-90 transition"
                        >
                            Send Inquiry
                        </button>
                    </div>

                    {/* Inquiry Form */}
                    {showInquiryForm && (
                        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold mb-4">Send Message</h3>

                            <form onSubmit={handleInquirySubmit} className="space-y-4">
                                <div>
                                    <label className="block font-semibold mb-2">
                                        Name
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
                                </div>

                                <div>
                                    <label className="block font-semibold mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        value={inquiryData.message}
                                        onChange={(e) =>
                                            setInquiryData({ ...inquiryData, message: e.target.value })
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
                                    {submitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
