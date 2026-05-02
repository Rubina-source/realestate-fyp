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
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/property/PropertyCard";
import { propertyService } from "../services/apiService";
import MapView from "../components/MapView";

const DEFAULT_FILTERS = {
  priceMin: "",
  priceMax: "",
  city: "",
  sizeMin: "",
  sizeMax: "",
  sizeUnit: "",
  propertyTypes: [],
};

const PROPERTY_TYPES = [
  { id: "apartment", label: "Apartment" },
  { id: "house", label: "House" },
  { id: "land", label: "Land" },
  { id: "commercial", label: "Commercial" },
  { id: "office", label: "Office" },
];

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchPurpose, setSearchPurpose] = useState("buy");
  const [searchType, setSearchType] = useState("");
  const [activeTab, setActiveTab] = useState("houses");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState({
    purpose: null,
    type: null,
  });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const fetchFeaturedProperties = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await propertyService.getAll({ limit: 6, ...filters });
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const brokersResponse = await propertyService.getPublicBrokers({
          limit: 6,
        });
        setBrokers(brokersResponse.data.data.brokers || []);
      } catch (error) {
        console.error("Failed to fetch brokers:", error);
      }
    };

    fetchFeaturedProperties();
    fetchBrokers();
  }, []);

  useEffect(() => {
    const filters = {};
    if (categoryFilter?.purpose) filters.purpose = categoryFilter.purpose;
    if (categoryFilter?.type) filters.type = categoryFilter.type;
    fetchFeaturedProperties(filters);
  }, [categoryFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword.trim()) params.set("keyword", searchKeyword);
    if (searchPurpose) params.set("purpose", searchPurpose);
    if (searchType) params.set("type", searchType);
    if (filters.priceMin) params.set("priceMin", filters.priceMin);
    if (filters.priceMax) params.set("priceMax", filters.priceMax);
    if (filters.sizeMin) params.set("sizeMin", filters.sizeMin);
    if (filters.sizeMax) params.set("sizeMax", filters.sizeMax);
    if (filters.sizeUnit) params.set("sizeUnit", filters.sizeUnit);
    if (filters.city) params.set("city", filters.city);
    if (filters.propertyTypes.length > 0) {
      params.set("types", filters.propertyTypes.join(","));
    }
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

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const cities = [
    "Kathmandu",
    "Pokhara",
    "Lalitpur",
    "Bhaktapur",
    "Biratnagar",
  ];

  const searchTabs = [
    { id: "houses", label: "Houses", kind: "type", value: "house" },
    { id: "apartments", label: "Apartments", kind: "type", value: "apartment" },
    { id: "lands", label: "Lands", kind: "type", value: "land" },
    { id: "rent", label: "Rent", kind: "purpose", value: "rent" },
  ];

  const handleSearchTab = (tab) => {
    if (tab.kind === "purpose") {
      setSearchPurpose(tab.value);
      setSearchType("");
    } else {
      setSearchType(tab.value);
    }
    setActiveTab(tab.id);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full bg-[url('https://images.pexels.com/photos/2443590/pexels-photo-2443590.jpeg')] bg-cover bg-center h-[32rem] sm:h-[28rem] md:h-[40rem] flex flex-col items-center justify-end pb-12">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute top-0 left-0 right-0 z-20">
          <Navbar transparent /> 
        </div>

        {/* Search Container */}
        <div className="absolute z-10 w-full max-w-[50%] px-4 md:px-6 bottom-32 left-12">
          <h1 className="text-xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Find it. Love it. Live it.
          </h1>
          <div className="rounded-2xl overflow-hidden p-2">
            {/* Tabs */}
            <div className="flex">
              {searchTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleSearchTab(tab)}
                  className={`px-6 md:-px-3 cursor-pointer py-4 font-semibold text-sm sm:text-base whitespace-nowrap transition bg-white dark:bg-neutral-900 first:rounded-tl-xl last:rounded-tr-xl  
                    ${
                      activeTab === tab.id
                        ? "border-b-2 border-primary"
                        : " border-b-2 border-transparent"
                    }`}
                >
                  {tab.label}
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
                  className="w-full pl-12 pr-4 py-3 text-sm bg-neutral-200 dark:bg-neutral-800 rounded-lg outline-none focus:ring-2 focus:ring-primary-dark"
                  placeholder="Search city, adress..."
                />
              </div>

              {/* Filters Button */}
              <button
                type="button"
                onClick={() => setShowFilterModal(true)}
                className="p-3 cursor-pointer border-1 border-neutral-200 dark:border-neutral-700 rounded-lg font-semibold flex items-center gap-2 justify-center"
              >
                <SlidersHorizontal size={20} />
              </button>

              {/* Search Button */}
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Filter Modal */}
      {showFilterModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowFilterModal(false)}
        >
          <div
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white/95 dark:bg-neutral-900/95 backdrop-blur">
              <div>
                <h3 className="text-lg font-bold">Refine Search</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Narrow results by price, city, size, and type
                </p>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
                aria-label="Close filters"
              >
                <X
                  size={20}
                  className="text-neutral-800 dark:text-neutral-200"
                />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Price Range
                </label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) =>
                      handleFilterChange("priceMin", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) =>
                      handleFilterChange("priceMax", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  />
                </div>
              </div>
              {/* City */}
              <div>
                <label className="block text-sm font-semibold mb-3">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city._id || city.id} value={city.name || city}>
                      {city.name || city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">
                  Property Size
                </label>
                <div className="space-y-2">
                  {/* Size Unit */}
                  <select
                    value={filters.sizeUnit || ""}
                    onChange={(e) =>
                      handleFilterChange("sizeUnit", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  >
                    <option value="">All Units</option>
                    <option value="sqft">Sqft</option>
                    <option value="ropani">Ropani</option>
                    <option value="aana">aana</option>
                  </select>
                  {/* Min/Max Size */}
                  <div className="flex gap-1">
                    <input
                      type="number"
                      placeholder="Min Size"
                      value={filters.sizeMin}
                      onChange={(e) =>
                        handleFilterChange("sizeMin", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    />
                    <input
                      type="number"
                      placeholder="Max Size"
                      value={filters.sizeMax}
                      onChange={(e) =>
                        handleFilterChange("sizeMax", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-semibold mb-4">
                  Property type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {PROPERTY_TYPES.map((type) => (
                    <label
                      key={type.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.propertyTypes.includes(type.id)}
                        onChange={() => handlePropertyTypeChange(type.id)}
                        className="w-5 h-5 accent-primary rounded cursor-pointer"
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Apply Filters */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark cursor-pointer transition"
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
            <h2 className="text-3xl font-bold">Explore all things property</h2>
            <Link
              to="/listings"
              className="text-blue-500 font-semibold hover:underline transition"
            >
              View All
            </Link>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { id: "all", label: "All Properties", purpose: null, type: null },
              { id: "buy", label: "Buying", purpose: "sale", type: null },
              { id: "rent", label: "Renting", purpose: "rent", type: null },
              { id: "house", label: "House", purpose: null, type: "house" },
              {
                id: "apartment",
                label: "Apartment",
                purpose: null,
                type: "apartment",
              },
              { id: "land", label: "Land", purpose: null, type: "land" },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() =>
                  setCategoryFilter({
                    purpose: filter.purpose,
                    type: filter.type,
                  })
                }
                className={`px-4 cursor-pointer py-1 rounded-full font-semibold transition ${
                  categoryFilter?.purpose === filter.purpose &&
                  categoryFilter?.type === filter.type
                    ? "border-primary border-2"
                    : "border-2"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
            {/* <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div> */}
            {/* {div} */}
          </div>
        </div>
        {loading && (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" />{" "}
            <span>Loading Properties...</span>
          </div>
        )}
      </div>

      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <MapView />
        </div>
      </div>

      {/* Local Brokers Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <h2 className="text-2xl font-bold mb-8">Local brokers</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brokers.map((broker) => (
              <Link
                key={broker._id}
                to={`/brokers/${broker._id}`}
                className="bg-white dark:bg-neutral-900 rounded-xl p-6 border dark:border-neutral-600 border-neutral-300 transition"
              >
                <img
                  src={
                    broker.profileImage ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
                  }
                  alt={broker.name}
                  className="w-16 h-16 rounded-full object-cover mb-4"
                />
                <h3 className="font-bold">{broker.name}</h3>
                <p className="text-sm mb-2">Real Estate Broker</p>
                {broker.city && (
                  <p className="text-sm">Based in {broker.city.name}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-primary py-16 px-6">
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
            className="inline-block bg-primary p-2 rounded-lg font-semibold hover:bg-primary-dark transition"
          >
            Become a Broker
          </Link>
        </div>
      </section>
    </div>
  );
}
