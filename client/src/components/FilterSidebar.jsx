import { useEffect, useState } from "react";
import { cityService } from "../services/apiService";

export default function FilterSidebar({ filters, onFilterChange }) {
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  // const cities = ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Biratnagar'];
  const propertyTypes = [
    { id: "apartment", label: "Apartment" },
    { id: "house", label: "House" },
    { id: "land", label: "Land" },
    { id: "commercial", label: "Commercial" },
  ];

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        const response = await cityService.getAll();
        const cityList = response.data.data || [];
        setCities(cityList);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        setCities([]);
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  const handlePropertyTypeToggle = (type) => {
    const currentTypes = filters.type ? filters.type.split(",") : [];
    let newTypes;
    if (currentTypes.includes(type)) {
      newTypes = currentTypes.filter((t) => t !== type);
    } else {
      newTypes = [...currentTypes, type];
    }
    const typeString = newTypes.length > 0 ? newTypes.join(",") : undefined;
    handleChange("type", typeString);
  };

  const selectedTypes = filters.type ? filters.type.split(",") : [];

  return (
    <div
      className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-4 md:p-6 h-fit sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto 
      [&::-webkit-scrollbar]:w-2 
      [&::-webkit-scrollbar-track]:bg-neutral-100 
      dark:[&::-webkit-scrollbar-track]:bg-neutral-900 
      [&::-webkit-scrollbar-thumb]:bg-neutral-300 
      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 
      [&::-webkit-scrollbar-thumb]:rounded-full
      "
    >
      <h3 className="font-bold text-lg mb-4">Filters</h3>

      {/* Property Type - Checkboxes */}
      <div className="">
        <label className="font-medium text-sm mb-3 block">Property Type</label>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <label
              key={type.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.id)}
                onChange={() => handlePropertyTypeToggle(type.id)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <div className="pt-4">
        <label className="font-medium text-sm mb-2 block">Purpose</label>
        <select
          value={filters.purpose || ""}
          onChange={(e) => handleChange("purpose", e.target.value || undefined)}
          className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
        >
          <option value="">All</option>
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
        </select>
      </div>

      {/* City */}
      <div className="pt-4">
        <label className="font-medium text-sm mb-2 block">City</label>
        <select
          value={filters.city || ""}
          disabled={citiesLoading}
          onChange={(e) => handleChange("city", e.target.value || undefined)}
          className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city._id} value={city._id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="pt-4">
        <label className="font-medium text-sm mb-2 block">Price Range</label>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min Price"
            value={filters.priceMin || ""}
            min={0}
            onChange={(e) =>
              handleChange("priceMin", e.target.value || undefined)
            }
            className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filters.priceMax || ""}
            min={0}
            onChange={(e) =>
              handleChange("priceMax", e.target.value || undefined)
            }
            className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="pt-4">
        <label className="font-medium text-sm mb-2 block">Property Size</label>
        <div className="space-y-2">
          {/* Size Unit */}
          <select
            value={filters.sizeUnit || ""}
            onChange={(e) =>
              handleChange("sizeUnit", e.target.value || undefined)
            }
            className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
          >
            <option value="">All Units</option>
            <option value="sqft">Sqft</option>
            <option value="ropani">Ropani</option>
          </select>

          {/* Min/Max Size */}
          <input
            type="number"
            placeholder="Min Size"
            value={filters.sizeMin || ""}
            min={0}
            onChange={(e) =>
              handleChange("sizeMin", e.target.value || undefined)
            }
            className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max Size"
            value={filters.sizeMax || ""}
            min={0}
            onChange={(e) =>
              handleChange("sizeMax", e.target.value || undefined)
            }
            className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <label className="font-medium text-sm mb-2 block">Sort By</label>
        <select
          value={filters.sort || "newest"}
          onChange={(e) => handleChange("sort", e.target.value)}
          className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={() => onFilterChange({ keyword: filters.keyword, page: 1 })}
        className="w-full bg-primary text-white cursor-pointer px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition text-sm"
      >
        Reset Filters
      </button>
    </div>
  );
}
