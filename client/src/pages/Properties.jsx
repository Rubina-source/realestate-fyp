import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { propertyService } from "../services/apiService";
import PropertyCard from "../components/property/PropertyCard";
import FilterSidebar from "../components/FilterSidebar";
import { Search } from "lucide-react";

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    purpose: searchParams.get("purpose") || "",
    city: searchParams.get("city") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    sizeMin: searchParams.get("sizeMin") || "",
    sizeMax: searchParams.get("sizeMax") || "",
    sizeUnit: searchParams.get("sizeUnit") || "",
    sort: searchParams.get("sort") || "newest",
    page: parseInt(searchParams.get("page")) || 1,
    limit: 12,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    console.log("@HI")
    /*  Object.entries(filters).forEach(([key, value]) => {
       if (key && key == "purpose") {
         params.set(key, value);
       }
     });
     setSearchParams(params, {
       replace: true,
     }); */
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchProperties = async () => {
        setLoading(true);
        try {
          const response = await propertyService.getAll(filters);
          setProperties(response.data.properties);
          setTotal(response.data.total);
        } catch (error) {
          console.error("Failed to fetch properties:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProperties();
    }, 500);

    return () => clearTimeout(handler);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "newest") {
        params.set(key, value);
      }
    });
    setSearchParams(params, {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 md:px-12">
      {/* Search Bar */}
      <div className="py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">
            Browse Properties
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) =>
              handleFilterChange({
                ...filters,
                keyword: e.target.value,
                page: 1,
              })
            }
            placeholder="Search by title, location..."
            className="flex-1 px-5 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 border border-neutral-200 dark:border-neutral-700 text-sm"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Properties Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              Loading properties...
            </div>
          ) : (
            <>
              <div className="mb-4 font-medium">
                Found {total} properties
              </div>

              {properties.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                    {properties.map((property) => (
                      <PropertyCard key={property._id} property={property} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {Math.ceil(total / filters.limit) > 1 && (
                    <div className="flex justify-center gap-1 md:gap-2 flex-wrap">
                      {Array.from(
                        { length: Math.ceil(total / filters.limit) },
                        (_, i) => i + 1,
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() =>
                            handleFilterChange({ ...filters, page })
                          }
                          className={`px-2 md:px-3 py-2 rounded-lg font-medium transition text-sm md:text-base ${filters.page === page
                            ? ""
                            : "border hover:bg-gray-100"
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  No properties found. Try adjusting your filters.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
