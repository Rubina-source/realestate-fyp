import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { propertyService } from "../services/apiService";
import { useTheme } from "../hooks/useTheme";

export default function Brokers() {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchBrokers = async () => {
      setLoading(true);
      try {
        const response = await propertyService.getPublicBrokers({ limit: 100 });
        setBrokers(response.data.data.brokers);
        setFilteredBrokers(response.data.data.brokers);
      } catch (error) {
        console.error("Failed to fetch brokers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrokers();
  }, []);

  useEffect(() => {
    const filtered = brokers.filter((broker) =>
      broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broker.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broker.city?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrokers(filtered);
  }, [searchTerm, brokers]);

  return (
    <div className={`min-h-screen`}>
      {/* Header Section */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-4 md:px-12">
          <h1 className="text-4xl font-bold mb-3">Find a Real Estate Broker</h1>
          <p className="text-lg mb-8">
            Connect with verified professional brokers in your area
          </p>

          {/* Search */}
          <div className="flex items-center gap-3 rounded-lg px-4 py-3 max-w-md dark:bg-neutral-700 bg-neutral-200">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name, company, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Brokers Container */}
      <div className="max-w-6xl mx-auto px-4 md:px-12 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-lg">
              Loading brokers...
            </div>
          </div>
        ) : filteredBrokers.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-lg">
              No brokers found
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-sm">
                Showing {filteredBrokers.length} broker{filteredBrokers.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Horizontal Scrolling Brokers Card */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-max">
                {filteredBrokers.map((broker) => (
                  <div
                    key={broker._id}
                    className={`flex-shrink-0 w-72 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 `}
                  >
                    <img
                      src={broker.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"}
                      alt={broker.name}
                      className="w-16 h-16 rounded-full object-cover mb-4"
                    />
                    <h3 className={`font-bold`}>
                      {broker.name}
                    </h3>
                    <p className={`text-sm mb-2`}>
                      Real Estate Broker
                    </p>
                    {broker.company && (
                      <p className={`text-sm mb-3`}>
                        {broker.company}
                      </p>
                    )}
                    {broker.city && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="flex-shrink-0" />
                        <p className={`text-sm`}>
                          Based in {broker.city.name}
                        </p>
                      </div>
                    )}

                    {/* Contact Button */}
                    {broker.email && (
                      <button
                        onClick={() => window.location.href = `mailto:${broker.email}?subject=Real Estate Inquiry`}
                        className="w-full mt-4 py-2 rounded-lg cursor-pointer font-semibold text-sm transition bg-orange-500 text-white"
                      >
                        Contact
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
