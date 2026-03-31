import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  TrendingUp,
  DollarSign,
  X,
  Search,
  FilterIcon,
  SlidersHorizontal,
} from "lucide-react";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/property/Propertycard";
import { propertyService } from "../services/apiService";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [propertyType, setPropertyType] = useState("buy");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(null); // null = all, "buy" = buying, "rent" = renting
  const [filters, setFilters] = useState({
    priceMin: "",
    priceMax: "",
    city: "",
    propertyTypes: [], // Array for multiple property type selections
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch featured properties
        const propertiesResponse = await propertyService.getAll({ limit: 6 });
        setProperties(propertiesResponse.data.properties);

        // Fetch public brokers
        const brokersResponse = await propertyService.getPublicBrokers({
          limit: 6,
        });
        setBrokers(brokersResponse.data.data.brokers || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.set("keyword", searchKeyword);
    params.set("purpose", propertyType);
    if (filters.priceMin) params.set("priceMin", filters.priceMin);
    if (filters.priceMax) params.set("priceMax", filters.priceMax);
    if (filters.city) params.set("city", filters.city);
    if (filters.type) params.set("type", filters.type);
    window.location.href = `/listings?${params.toString()}`;
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePropertyTypeChange = (type) => {
    setFilters((prev) => {
      const types = prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type];
      return { ...prev, propertyTypes: types };
    });
  };

  const cities = ["Kathmandu", "Pokhara", "Lalitpur", "Bhaktapur", "Biratnagar"];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full bg-[url('https://images.pexels.com/photos/2443590/pexels-photo-2443590.jpeg')] bg-cover bg-center h-[32rem] sm:h-[28rem] md:h-[40rem] flex flex-col items-center justify-end pb-12">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute top-0 left-0 right-0 z-20">
          <Navbar transparent /> {/* pass a prop to style it for dark bg */}
        </div>

        {/* Search Container */}
        <div className="absolute z-10 w-full max-w-[50%] px-4 md:px-6 bottom-32 left-12">
          <h1 className="text-xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Find it. Love it. Live it.
          </h1>
          <div className="rounded-2xl overflow-hidden p-2">
            {/* Tabs */}
            <div className="flex">
              {["Buy", "Rent"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPropertyType(tab.toLowerCase())}
                  className={`px-6 py-4 font-semibold text-sm sm:text-base whitespace-nowrap transition bg-white dark:bg-neutral-900 first:rounded-tl-xl last:rounded-tr-xl  
                    ${propertyType === tab.toLowerCase() ||
                      (tab === "Buy" && propertyType === "buy")
                      ? "border-b-2 border-orange-500"
                      : " border-b-2 border-transparent"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="p-4 sm:p-6 flex flex-col sm:flex-row gap-3 items-center bg-white dark:bg-neutral-900 rounded-bl-xl rounded-r-xl "
            >
              {/* Search Input */}
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-sm bg-neutral-200 dark:bg-neutral-800 rounded-lg outline-none focus:ring-2 focus:ring-[#E8413B]"
                  placeholder="Search city, adress..."
                />
              </div>

              {/* Filters Button */}
              <button
                type="button"
                onClick={() => setShowFilterModal(true)}
                className="p-3 border-2 rounded-lg font-semibold flex items-center gap-2 justify-center"
              >
                <SlidersHorizontal size={20} />
              </button>

              {/* Search Button */}
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-300 dark:bg-neutral-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex justify-between items-center p-4 border-b border-neutral-300 dark:border-neutral-600 bg-neutral-300 dark:bg-neutral-800">
              <h3 className="text-lg font-bold">Filters</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
              >
                <X size={20} className="text-neutral-800 dark:text-neutral-200" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold mb-3">Price Range</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                    className="flex-1 px-1 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-300 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                    className="flex-1 px-1 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-300 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              {/* City */}
              <div>
                <label className="block text-sm font-semibold mb-3">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city._id || city.id} value={city.name || city}>
                      {city.name || city}
                    </option>
                  ))}
                </select>
              </div>
              {/* Property Type */}
              <div>
                <label className="block text-sm font-semibold mb-4">Property type</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "apartment", label: "Apartment" },
                    { id: "house", label: "House" },
                    { id: "land", label: "Land" },
                    { id: "commercial", label: "Commercial" },
                    { id: "office", label: "Office" },
                  ].map((type) => (
                    <label
                      key={type.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.propertyTypes.includes(type.id)}
                        onChange={() => handlePropertyTypeChange(type.id)}
                        className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Apply Filters */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() =>
                    setFilters({
                      priceMin: "",
                      priceMax: "",
                      propertyTypes: [],
                    })
                  }
                  className="flex-1 px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-brand-orange/80 cursor-pointer transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explore All Properties - Combined Section with Filters */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              Explore all things property
            </h2>
            <Link
              to="/listings"
              className="text-orange-500 font-semibold hover:underline transition"
            >
              View All
            </Link>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { id: null, label: "All Properties" },
              { id: "buy", label: "Buying" },
              { id: "rent", label: "Renting" },
              { id: "sell", label: "Selling" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setCategoryFilter(filter.id)}
                className={`px-4 cursor-pointer py-1 rounded-full font-semibold transition ${categoryFilter === filter.id
                  ? "border-orange-500 border-2"
                  : "border-2"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {properties
              .filter((property) => {
                if (categoryFilter === null) return true;
                if (categoryFilter === "buy")
                  return property.purpose === "sale";
                if (categoryFilter === "rent")
                  return property.purpose === "rent";
                if (categoryFilter === "sell")
                  return property.purpose === "sell";
                return true;
              })
              .map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
          </div>
        </div>
      </div>

      {/* Local Brokers Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="text-2xl font-bold mb-8">
            Local brokers
          </h2>

          {/* Horizontal Scrolling Brokers */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              {
                brokers.map((broker) => {
                  return (
                    <div
                      key={broker._id}
                      className="flex-shrink-0 w-72 bg-white dark:bg-neutral-900 rounded-xl p-6 border dark:border-neutral-600 border-neutral-300 transition"
                    >
                      <img
                        src={broker.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"}
                        alt={broker.name}
                        className="w-16 h-16 rounded-full object-cover mb-4"
                      />
                      <h3 className="font-bold">
                        {broker.name}
                      </h3>
                      <p className="text-sm mb-2">
                        {"Real Estate Broker"}
                      </p>
                      {broker.city && <p className="text-sm">
                        Based in {broker.city.name}
                      </p>}
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-orange-500 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Ready to List Your Property?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Join verified brokers and reach thousands of potential buyers and
            renters on GharBazar
          </p>
          <Link
            to="/broker-signup"
            className="inline-block bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-orange- transition"
          >
            Become a Broker
          </Link>
        </div>
      </section>
    </div>
  );
}
