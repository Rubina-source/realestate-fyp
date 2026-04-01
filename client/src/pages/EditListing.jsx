import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { propertyService, cityService } from "../services/apiService";
import MapLocationPicker from "../components/MapLocationPicker";
import { Upload, Loader, AlertCircle, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function EditListing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "apartment",
    purpose: "sale",
    rentalType: "",
    city: "",
    address: "",
    location: {},
    sizeValue: "",
    sizeUnit: "sqft",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    images: [],
    amenities: [],
  });

  const types = ["apartment", "land", "house", "commercial", "office"];

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        const response = await cityService.getAll();
        setCities(response.data.data || []);
      } catch {
        toast.error("Failed to load cities");
      } finally {
        setCitiesLoading(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await propertyService.getById(id);
        const property = response.data.property;
        setFormData({
          title: property.title || "",
          description: property.description || "",
          price: property.price || "",
          type: property.type || "apartment",
          purpose: property.purpose || "sale",
          rentalType: property.rentalType || "",
          city: property.city || "",
          address: property.location?.address || "",
          location: {
            lat: property.location?.lat || 27.7172,
            lng: property.location?.lng || 85.324,
          },
          sizeValue: property.size?.value || "",
          sizeUnit: property.size?.unit || "sqft",
          bedrooms: property.bedrooms || "",
          bathrooms: property.bathrooms || "",
          parking: property.parking || "",
          images: property.images || [],
          amenities: property.amenities || [],
        });
      } catch {
        toast.error("Failed to load property details");
        navigate("/broker/dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["price", "sizeValue", "bedrooms", "bathrooms", "parking"].includes(name)) {
      if (value !== "" && Number(value) < 0) return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (coords) => {
    setFormData({ ...formData, location: coords });
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) throw new Error("Cloudinary configuration missing");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: fd }
    );
    if (!response.ok) throw new Error("Failed to upload image to Cloudinary");
    const data = await response.json();
    return data.secure_url;
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      const newImages = [...formData.images];
      const filesToUpload = Array.from(files).slice(0, 5 - newImages.length);
      for (const file of filesToUpload) {
        newImages.push(await uploadToCloudinary(file));
      }
      setFormData({ ...formData, images: newImages });
    } catch (error) {
      toast.error(error.message || "Failed to upload images.");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const removeImage = (index) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        type: formData.type,
        purpose: formData.purpose,
        rentalType: formData.rentalType || null,
        city: formData.city,
        location: {
          address: formData.address,
          lat: Number(formData.location.lat),
          lng: Number(formData.location.lng),
        },
        size: { value: Number(formData.sizeValue), unit: formData.sizeUnit },
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
        parking: formData.parking ? Number(formData.parking) : null,
        images: formData.images,
        amenities: formData.amenities,
      };
      await propertyService.update(id, payload);
      toast.success("Property updated successfully! Awaiting admin approval.");
      navigate("/broker/dashboard");
    } catch (error) {
      const msg =
        (error.response?.data?.errors && error.response.data.errors.join(", ")) ||
        error.response?.data?.message ||
        "Failed to update listing";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-orange-500" size={24} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="p-8 md:p-10">
          {/* Header */}
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
            Edit Listing
          </h1>
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mb-8">
            Update your property details
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Property Title <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Modern Apartment in Kathmandu"
                className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Description <span className="text-orange-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe the property features, amenities, and condition..."
                className={"border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none resize-none"}
              />
            </div>

            {/* Type & Purpose */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-2 text-sm">
                  Property Type <span className="text-orange-500">*</span>
                </label>
                <select name="type" value={formData.type} onChange={handleChange} className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none">
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-sm">
                  Purpose <span className="text-orange-500">*</span>
                </label>
                <select name="purpose" value={formData.purpose} onChange={handleChange} className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none">
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                </select>
              </div>
            </div>

            {/* Rental Type */}
            {formData.purpose === "rent" && (
              <div>
                <label className="block font-semibold mb-2 text-sm">
                  Rental Type <span className="text-orange-500">*</span>
                </label>
                <select name="rentalType" value={formData.rentalType} onChange={handleChange} className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none">
                  <option value="">Select rental type</option>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}

            {/* Bedrooms / Bathrooms / Parking */}
            <div className="grid grid-cols-3 gap-3">
              {["apartment", "house"].includes(formData.type) && (
                <div>
                  <label className="block font-semibold mb-2 text-sm">Bedrooms</label>
                  <input type="number" name="bedrooms" min="0" placeholder="0"
                    value={formData.bedrooms} onChange={handleChange} className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none" />
                </div>
              )}
              {["apartment", "house"].includes(formData.type) && (
                <div>
                  <label className="block font-semibold mb-2 text-sm">Bathrooms</label>
                  <input type="number" name="bathrooms" min="0" placeholder="0"
                    value={formData.bathrooms} onChange={handleChange} className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none" />
                </div>
              )}
              {["apartment", "house", "office", "commercial"].includes(formData.type) && (
                <div>
                  <label className="block font-semibold mb-2 text-sm">Parking</label>
                  <input type="number" name="parking" min="0" placeholder="0"
                    value={formData.parking} onChange={handleChange} className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none" />
                </div>
              )}
            </div>

            {/* Amenities */}
            <div>
              <label className="block font-semibold mb-2 text-sm">Amenities</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Bathroom", "Living room", "Terrace", "Security",
                  "Price negotiable", "Garden", "Swimming Pool", "Gym",
                  "Lift", "Water Supply", "Electricity Backup", "Internet",
                  "Kitchen", "Balcony",
                ].map((amenity) => (
                  <label key={amenity} className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Price (Rs) <span className="text-orange-500">*</span>
              </label>
              <input type="number" name="price" value={formData.price}
                onChange={handleChange} required placeholder="0" className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none" />
            </div>

            {/* Map */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Location <span className="text-orange-500">*</span>
              </label>
              <MapLocationPicker
                onLocationChange={handleLocationChange}
                initialCoords={formData.location}
              />
            </div>

            {/* City & Address */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-2 text-sm">
                  City <span className="text-orange-500">*</span>
                </label>
                <select name="city" value={formData.city._id} onChange={handleChange}
                  disabled={citiesLoading} required className={"border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none disabled:opacity-50"}>
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>{city.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2 text-sm">
                  Address <span className="text-orange-500">*</span>
                </label>
                <input type="text" name="address" value={formData.address}
                  onChange={handleChange} required placeholder="Street address" className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none" />
              </div>
            </div>

            {/* Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-2 text-sm">
                  Size Value <span className="text-orange-500">*</span>
                </label>
                <input type="number" name="sizeValue" value={formData.sizeValue}
                  onChange={handleChange} required placeholder="0" className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none" />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-sm">
                  Unit <span className="text-orange-500">*</span>
                </label>
                <select name="sizeUnit" value={formData.sizeUnit} onChange={handleChange} className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none">
                  <option value="sqft">Sq Ft</option>
                  <option value="ropani">Ropani</option>
                  <option value="aana">Aana</option>
                </select>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <label className="block font-semibold mb-2 text-sm">
                Upload Images (1-5) <span className="text-orange-500">*</span>
              </label>

              <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg p-8 text-center hover:border-orange-500 transition">
                {uploadingImages ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader className="animate-spin text-orange-500" size={32} />
                    <p className="text-sm">Uploading images...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto mb-3 text-orange-500 opacity-70" size={32} />
                    <input
                      type="file" multiple accept="image/*"
                      onChange={handleImageUpload}
                      disabled={formData.images.length >= 5 || uploadingImages}
                      className="hidden" id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <span className="text-orange-500 font-semibold">Click to upload</span>
                    </label>
                    <p className="text-xs text-neutral-400 mt-1">{formData.images.length}/5 images</p>
                  </>
                )}
              </div>

              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm mb-3">{formData.images.length} image(s) uploaded</p>
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative rounded-lg aspect-square overflow-hidden group">
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button" onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/broker/dashboard")}
                className="flex-1 px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || uploadingImages}
                className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><Loader className="animate-spin" size={18} /> Updating...</>
                ) : uploadingImages ? (
                  <><Loader className="animate-spin" size={18} /> Uploading Images...</>
                ) : (
                  "Update Listing"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}