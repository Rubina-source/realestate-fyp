import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { propertyService, cityService } from "../services/apiService";
import MapLocationPicker from "../components/MapLocationPicker";
import { Upload, Loader, X } from "lucide-react";
import BrokerLayout from "../components/BrokerLayout";
import { toast } from "react-hot-toast";

export default function CreateListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    amenities: [],
  });

  const types = ["apartment", "land", "house", "commercial"];

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        const response = await cityService.getAll();
        const cityList = response.data.data || [];
        setCities(cityList);

        // Set first city as default
        if (cityList.length > 0 && !formData.city) {
          setFormData((prev) => ({ ...prev, city: cityList[0]._id }));
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        toast.error("Failed to load cities");
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log({ name, value })
    if (
      ["price", "sizeValue", "bedrooms", "bathrooms", "parking"].includes(name)
    ) {
      if (value !== "" && Number(value) < 0) {
        return; // Reject negative values
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (coords) => {
    setFormData({ ...formData, location: coords });
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };


  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration missing");
    }

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formDataUpload,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const newImages = [...formData.images];
      const remainingSlots = 5 - newImages.length;
      const filesToUpload = Array.from(files).slice(0, remainingSlots);

      for (const file of filesToUpload) {
        const url = await uploadToCloudinary(file);
        newImages.push(url);
      }

      setFormData({ ...formData, images: newImages });
    } catch (error) {
      const msg = error.message || "Failed to upload images. Please try again.";
      toast.error(msg);
    } finally {
      setUploadingImages(false);
      // Reset input
      e.target.value = "";
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        type: formData.type,
        purpose: formData.purpose,
        city: formData.city,
        location: {
          address: formData.address,
          lat: Number(formData.location.lat),
          lng: Number(formData.location.lng),
        },
        size: {
          value: Number(formData.sizeValue),
          unit: formData.sizeUnit,
        },
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
        parking: formData.parking ? Number(formData.parking) : null,
        images: formData.images,
        amenities: formData.amenities,
      };

      await propertyService.create(payload);
      toast.success("Property listed successfully! Awaiting admin approval.");
      navigate("/broker/dashboard");
    } catch (error) {
      let errorMsg =
        (error.response?.data?.errors && error.response.data.errors.join(", ")) ||
        error.response?.data?.message ||
        "Failed to create listing";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrokerLayout>
      <div className="flex items-center justify-center">
        <div className=" w-4xl mx-auto">
          {/* Main Card */}
          <div className="p-8 md:p-10">
            {/* Header */}
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
              Create New Listing
            </h1>
            <p className="text-center mb-8">
              Add a new property
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Property Title <span className="text-[#E8413B]">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Modern Apartment in Kathmandu"
                    className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none" />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Description <span className="text-[#E8413B]">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Describe the property features, amenities, and condition..."
                    className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none" />
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4 pt-4">
                {/* Property Type & Purpose */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-2 text-sm">
                      Property Type <span className="text-[#E8413B]">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none">
                      {types.map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-sm">
                      Purpose <span className="text-[#E8413B]">*</span>
                    </label>
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                    >
                      <option value="sale">Sale</option>
                      <option value="rent">Rent</option>
                    </select>
                  </div>
                </div>
                {
                  formData.purpose === "rent" && (
                    <div>
                      <label className="block font-semibold mb-2 text-sm">
                        Rental Type{" "}
                        <span
                          className={formData.purpose === "rent" ? "text-[#E8413B]" : ""}
                        >
                          *
                        </span>
                      </label>
                      <select
                        name="rentalType"
                        value={formData.rentalType}
                        onChange={handleChange}
                        disabled={formData.purpose !== "rent"}
                        className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select rental type</option>
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  )
                }
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-3 gap-3 pb-4">
                    {["apartment", "house"].includes(formData.type) && (
                      <div>
                        <label className="block font-semibold mb-2 text-sm">
                          Bedrooms
                        </label>
                        <input
                          name="bedrooms"
                          type="number"
                          min="0"
                          placeholder="0"
                          value={formData.bedrooms}
                          onChange={handleChange}
                          className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                        />
                      </div>
                    )}

                    {["apartment", "house"].includes(formData.type) && (
                      <div>
                        <label className="block font-semibold mb-2 text-sm">
                          Bathrooms
                        </label>
                        <input
                          name="bathrooms"
                          type="number"
                          min="0"
                          placeholder="0"
                          value={formData.bathrooms}
                          onChange={handleChange}
                          className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                        />
                      </div>
                    )}
                    {["apartment", "house", "office", "commercial"].includes(formData.type) && (
                      <div>
                        <label className="block font-semibold mb-2 text-sm">
                          Parking
                        </label>
                        <input
                          name="parking"
                          type="number"
                          min="0"
                          placeholder="0"
                          value={formData.parking}
                          onChange={handleChange}
                          className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Other Amenities (Checkboxes) */}
                  <div className="">
                    <p className="block font-semibold mb-2 text-sm">
                      Amenities
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Bathroom",
                        "Living room",
                        "Terrace",
                        "Security",
                        "Price negotiable",
                        "Garden",
                        "Swimming Pool",
                        "Gym",
                        "Lift",
                        "Water Supply",
                        "Electricity Backup",
                        "Internet",
                        "Kitchen",
                        "Balcony",
                      ].map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-3 cursor-pointer p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                        >
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                            className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                          />
                          <span className="text-sm ">
                            {amenity}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Price (Rs) <span className="text-[#E8413B]">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="0"
                    className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Location & Address */}
              <div className="space-y-4 pt-4">
                {/* Map */}
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Location <span className="text-[#E8413B]">*</span>
                  </label>
                  <MapLocationPicker
                    value={formData.location}
                    onChange={handleLocationChange}
                    defaultCity={formData.city}
                  />
                </div>

                {/* City & Address */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-2 text-sm">
                      City <span className="text-[#E8413B]">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={citiesLoading}
                      className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                    >
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city._id} value={city._id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-sm">
                      Address <span className="text-[#E8413B]">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Street address"
                      className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Property Specifications */}
              <div className="space-y-4 pt-4">
                {/* Size */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-2 text-sm">
                      Size Value <span className="text-[#E8413B]">*</span>
                    </label>
                    <input
                      type="number"
                      name="sizeValue"
                      value={formData.sizeValue}
                      onChange={handleChange}
                      required
                      placeholder="0"
                      className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-sm">
                      Unit <span className="text-[#E8413B]">*</span>
                    </label>
                    <select
                      name="sizeUnit"
                      value={formData.sizeUnit}
                      onChange={handleChange}
                      className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                    >
                      <option value="sqft">Sq Ft</option>
                      <option value="ropani">Ropani</option>
                      <option value="aana">Aana</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4 pt-4 border-t border-[#E0E0E0] dark:border-[#2E2E3E]">
                <label className="block font-semibold mb-2 text-sm">
                  Upload Images (1-5) <span className="text-[#E8413B]">*</span>
                </label>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-[#E0E0E0] dark:border-[#2E2E3E] rounded-lg p-8 text-center hover:border-[#E8413B] dark:hover:border-[#E8413B] transition">
                  {uploadingImages ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader className="animate-spin text-[#E8413B]" size={32} />
                      <p className="text-sm">
                        Uploading images...
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload
                        className="mx-auto mb-3 text-orange-500 opacity-70"
                        size={32}
                      />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                        className="hidden"
                        id="imageUpload"
                      />
                      <label htmlFor="imageUpload" className="cursor-pointer">
                        <span className="text-orange-500 font-semibold">
                          Click to upload
                        </span>
                      </label>
                    </>
                  )}
                </div>

                {/* Image Gallery */}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm mb-3">
                      {formData.images.length} image(s) uploaded
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative rounded-lg aspect-square overflow-hidden group"
                        >
                          <img
                            src={img}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
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

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || uploadingImages}
                  className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 cursor-pointer text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Creating Listing...
                    </>
                  ) : uploadingImages ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Uploading Images...
                    </>
                  ) : (
                    "Create Listing"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div >
    </BrokerLayout >
  );
}
