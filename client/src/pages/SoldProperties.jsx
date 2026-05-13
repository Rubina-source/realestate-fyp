import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  Calendar,
  Map as MapIcon,
  MapPin,
  List as ListIcon,
  Image as ImageIcon,
  Eye,
  SlidersHorizontal,
  X,
  AreaChartIcon,
} from "lucide-react";
import { propertyService } from "../services/apiService";
import { priceFormatter } from "../lib/price-formatter";
import { PROPERTY_TYPES } from "../lib/property-filters";

const DEFAULT_FILTERS = {
  type: "all",
  priceMin: "",
  priceMax: "",
  soldDatePreset: "any",
  soldDateFrom: "",
  soldDateTo: "",
  bedroomsMin: "",
  bathroomsMin: "",
  parkingMin: "",
  sizeMin: "",
  sizeMax: "",
  sizeUnit: "",
};

export default function SoldProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const [sort, setSort] = useState("newest");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);
  const limit = 12;
  const sentinelRef = useRef(null);

  const applyFilters = () => {
    const soldDateRange = getSoldDateRange(draftFilters.soldDatePreset);
    setAppliedFilters({
      ...draftFilters,
      soldDateFrom: soldDateRange.from,
      soldDateTo: soldDateRange.to,
    });
    setPage(1);
    setProperties([]);
    setHasMore(true);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
  };

  const clearAppliedFilters = () => {
    setAppliedFilters(DEFAULT_FILTERS);
    setPage(1);
    setHasMore(true);
  };

  useEffect(() => {
    const fetchSoldProperties = async () => {
      try {
        if (page === 1) {
          setLoading(true);
        }
        setIsFetching(true);
        const response = await propertyService.getAll({
          status: "sold",
          page,
          limit,
          sort,
          type: appliedFilters.type === "all" ? undefined : appliedFilters.type,
          priceMin: appliedFilters.priceMin || undefined,
          priceMax: appliedFilters.priceMax || undefined,
          soldDateFrom: appliedFilters.soldDateFrom || undefined,
          soldDateTo: appliedFilters.soldDateTo || undefined,
          bedroomsMin: appliedFilters.bedroomsMin || undefined,
          bathroomsMin: appliedFilters.bathroomsMin || undefined,
          parkingMin: appliedFilters.parkingMin || undefined,
          sizeMin: appliedFilters.sizeMin || undefined,
          sizeMax: appliedFilters.sizeMax || undefined,
          sizeUnit: appliedFilters.sizeUnit || undefined,
        });
        const fetched = response.data.properties || [];
        setProperties((prev) => (page === 1 ? fetched : [...prev, ...fetched]));
        const nextTotal = response.data.total || 0;
        setTotal(nextTotal);
        setHasMore(fetched.length === limit && page * limit < nextTotal);
      } catch (error) {
        console.error("Failed to fetch sold properties:", error);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    };

    fetchSoldProperties();
  }, [page, sort, appliedFilters]);

  useEffect(() => {
    if (viewMode !== "list") return;
    if (!hasMore || loading || isFetching) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isFetching, loading, viewMode]);

  const mapCenter = useMemo(() => {
    const firstWithLocation = properties.find(
      (property) => property.location?.lat && property.location?.lng,
    );
    if (firstWithLocation) {
      return [firstWithLocation.location.lat, firstWithLocation.location.lng];
    }
    return [27.7172, 85.334];
  }, [properties]);

  const formatSoldDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  const formatCompactPrice = (price) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(1).replace(/\.0$/, "")}Cr`;
    }
    if (price >= 100000) {
      return `${(price / 100000).toFixed(1).replace(/\.0$/, "")}L`;
    }
    if (price >= 1000) {
      return `${(price / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return price;
  };

  const getSoldDateRange = (preset) => {
    if (!preset || preset === "any") {
      return { from: "", to: "" };
    }

    const now = new Date();
    const from = new Date(now);

    if (preset === "24h") {
      from.setHours(from.getHours() - 24);
    } else if (preset === "3d") {
      from.setDate(from.getDate() - 3);
    } else if (preset === "7d") {
      from.setDate(from.getDate() - 7);
    } else if (preset === "30d") {
      from.setDate(from.getDate() - 30);
    } else if (preset === "3y") {
      from.setFullYear(from.getFullYear() - 3);
    }

    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(now);
    toDate.setHours(23, 59, 59, 999);

    return {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    };
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 md:px-12">
      <div className="py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sold Properties</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Listings marked as sold with public sale history.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-1 py-1 shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                className={`cursor-pointer flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === "list"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 dark:text-neutral-300"
                }`}
                aria-pressed={viewMode === "list"}
              >
                <ListIcon size={14} />
                List
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`cursor-pointer flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === "map"
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 dark:text-neutral-300"
                }`}
                aria-pressed={viewMode === "map"}
              >
                <MapIcon size={14} />
                Map
              </button>
            </div>

            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
                setProperties([]);
                setHasMore(true);
              }}
              className="border text-xs font-semibold p-2 rounded-md bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus:outline-none"
            >
              <option value="newest">Sort: Latest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="price-low">Sort: Price Low to High</option>
              <option value="price-high">Sort: Price High to Low</option>
            </select>

            <button
              onClick={() => {
                setDraftFilters(appliedFilters);
                setShowFilterModal(true);
              }}
              className="cursor-pointer px-4 py-2 rounded-md text-xs font-semibold border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center gap-2"
            >
              <SlidersHorizontal size={14} />
              Filter
            </button>

            <button
              onClick={clearAppliedFilters}
              className="cursor-pointer px-4 py-2 rounded-md text-xs font-semibold border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"
            >
              Clear filters
            </button>
          </div>
        </div>

        {showFilterModal && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setShowFilterModal(false)}
          >
            <div
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky top-0 flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white/95 dark:bg-neutral-900/95 backdrop-blur">
                <div>
                  <h3 className="text-lg font-bold">Filters</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Refine by price, sold date, rooms, parking, and land size
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
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Property Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[{ id: "all", label: "All" }, ...PROPERTY_TYPES].map(
                      (option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            setDraftFilters((prev) => ({
                              ...prev,
                              type: option.id,
                            }))
                          }
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition border ${
                            draftFilters.type === option.id
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"
                          }`}
                        >
                          {option.label}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Price
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={0}
                      placeholder="Min"
                      value={draftFilters.priceMin}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          priceMin: event.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="Max"
                      value={draftFilters.priceMax}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          priceMax: event.target.value,
                        }))
                      }
                      className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Sold Date
                  </label>
                  <select
                    value={draftFilters.soldDatePreset}
                    onChange={(event) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        soldDatePreset: event.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  >
                    <option value="any">Any</option>
                    <option value="24h">Last 24 hrs</option>
                    <option value="3d">Last 3 days</option>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last month</option>
                    <option value="3y">Last 3 years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Bedrooms
                  </label>
                  <select
                    value={draftFilters.bedroomsMin}
                    onChange={(event) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        bedroomsMin: event.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Bathrooms
                  </label>
                  <select
                    value={draftFilters.bathroomsMin}
                    onChange={(event) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        bathroomsMin: event.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Car Spaces
                  </label>
                  <select
                    value={draftFilters.parkingMin}
                    onChange={(event) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        parkingMin: event.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Land Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      min={0}
                      placeholder="Min"
                      value={draftFilters.sizeMin}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          sizeMin: event.target.value,
                        }))
                      }
                      className="col-span-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="Max"
                      value={draftFilters.sizeMax}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          sizeMax: event.target.value,
                        }))
                      }
                      className="col-span-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    />
                    <select
                      value={draftFilters.sizeUnit}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          sizeUnit: event.target.value,
                        }))
                      }
                      className="col-span-1 px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    >
                      <option value="">Unit</option>
                      <option value="sqft">Sqft</option>
                      <option value="aana">Aana</option>
                      <option value="ropani">Ropani</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    Clear filters
                  </button>
                  <button
                    type="button"
                    onClick={applyFilters}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-24">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-neutral-300 dark:border-neutral-600 border-t-primary rounded-full"></div>
            <p className="mt-4">Loading sold properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-neutral-800 flex items-center justify-center">
              <ImageIcon size={22} />
            </div>
            <p className="text-lg font-medium">No sold properties found.</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Check back later for recent sales history.
            </p>
          </div>
        ) : (
          <>
            {viewMode === "map" ? (
              <div className=" overflow-hidden">
                <div className="h-[520px]">
                  <MapContainer
                    center={mapCenter}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {properties
                      .filter((property) => property.location)
                      .map((property) => (
                        <Marker
                          key={property._id}
                          position={[
                            property.location.lat,
                            property.location.lng,
                          ]}
                          icon={L.divIcon({
                            className: "custom-price-marker",
                            html: `
      <div class=\"bg-neutral-900 text-white text-[11px] px-1 py-1 rounded-md  whitespace-nowrap\">
        Rs. ${formatCompactPrice(property.price || 0)}
      </div>
    `,
                            iconSize: [60, 24],
                            iconAnchor: [30, 24],
                          })}
                        >
                          <Popup maxWidth={260}>
                            <div className="w-60">
                              <img
                                src={
                                  property.images?.[0] ||
                                  "https://via.placeholder.com/400x300"
                                }
                                alt={property.title}
                                className="w-full h-32 object-cover rounded-xs"
                              />
                              <div className="mt-2 space-y-1">
                                <h3 className="text-sm font-semibold line-clamp-2">
                                  {property.title}
                                </h3>
                                <p className="text-xs ">
                                  {property.location?.address}
                                </p>
                                <p className="text-sm font-bold ">
                                  {priceFormatter(property.price)}
                                </p>
                                <Link
                                  to={`/listings/${property._id}`}
                                  className="block w-full mt-2 bg-primary text-white text-xs py-1.5 rounded-md text-center hover:bg-primary-dark transition"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                  </MapContainer>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => {
                  const brokerAvatar = property.broker?.profileImage || "";
                  const brokerInitial =
                    property.broker?.name?.charAt(0)?.toUpperCase() || "B";
                  const addressText =
                    property.location?.address || "Location not set";

                  return (
                    <Link
                      key={property._id}
                      to={`/listings/${property._id}`}
                      className="group rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden transition"
                    >
                      <div className="relative">
                        <Swiper
                          modules={[Navigation]}
                          navigation
                          className="h-64"
                        >
                          {(property.images?.length
                            ? property.images
                            : ["/placeholder.jpg"]
                          ).map((image, idx) => (
                            <SwiperSlide key={`${property._id}-image-${idx}`}>
                              <img
                                src={image}
                                alt={`${property.title} ${idx + 1}`}
                                className="h-64 w-full object-cover"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>

                        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 rounded-full bg-white/90 px-2.5 py-1 shadow-sm">
                          <span className="text-xs font-semibold text-neutral-900">
                            {property.broker?.name || "Broker"}
                          </span>
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center text-xs font-semibold text-neutral-700">
                            {brokerAvatar ? (
                              <img
                                src={brokerAvatar}
                                alt={property.broker?.name || "Broker"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              brokerInitial
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <h2 className="text-lg font-semibold line-clamp-2">
                            {property.title}
                          </h2>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2 mt-1">
                            <MapPin size={14} />
                            <span className="line-clamp-1">{addressText}</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-xl font-bold">
                            {priceFormatter(property.price)}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 text-sm ">
                          <p>{property.location.address}</p>
                          <p className="flex items-center gap-2">
                            <span>
                              {property.size?.value
                                ? `${property.size.value} ${property.size.unit}`
                                : "Size N/A"}
                            </span>
                            <span>•</span>
                            <span>{property.type || "Property"}</span>
                          </p>
                          {/* <span className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1">
                            {property.size?.value
                              ? `${property.size.value} ${property.size.unit}`
                              : "Size N/A"}
                          </span>
                          <span className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1">
                            {property.type || "Property"}
                          </span> */}
                        </div>
                        <div className="flex items-center gap-2 text-sm ">
                          <Calendar size={14} />
                          Sold on {formatSoldDate(property.updatedAt)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            {viewMode === "list" && (
              <div className="mt-10 flex flex-col items-center gap-3">
                {isFetching && (
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-neutral-300 dark:border-neutral-600 border-t-primary rounded-full"></span>
                    Loading more properties...
                  </div>
                )}
                {!hasMore && properties.length > 0 && (
                  <p className="text-xs text-neutral-500">
                    You have reached the end of the list.
                  </p>
                )}
                <div ref={sentinelRef} className="h-8 w-full" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
