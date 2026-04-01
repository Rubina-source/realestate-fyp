import { useEffect, useState } from "react";
import { propertyService } from "../services/apiService";
import BrokerLayout from "../components/BrokerLayout";
import { ArrowLeft, ArrowRight, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function BrokerProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchBrokerProperties();
  }, [page]);

  const fetchBrokerProperties = async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      const response = await propertyService.getBrokerProperties(params);
      setProperties(response.data.properties);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch broker properties:", error);
      toast.error("Failed to load your properties");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <BrokerLayout>
        <div className="text-center py-64">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-neutral-300 dark:border-neutral-600 border-t-[#E8413B] rounded-full"></div>
          <p className="mt-4">
            Loading your properties...
          </p>
        </div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Your Property Listings
        </h1>
        <p className="text-sm">
          List of all your property listings.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-neutral-200 dark:border-neutral-700 border-t-[#E8413B] rounded-full mb-4"></div>
            <p className="font-medium">
              Loading properties...
            </p>
          </div>
        </div>
      ) : properties.length === 0 ? (
        <div className="flex items-center justify-center dark:bg-orange-900/10 bg-orange-50 p-6 rounded-lg">
          <p className="text-lg font-medium">No properties found.</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 uppercase tracking-wide font-medium">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Purpose
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Size
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr
                    key={property._id}
                    className="bg-white dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium">
                      {property.title}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {property.type}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {property.purpose}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {property.price}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {property.size ? (
                        <>
                          {property.size.value} {property.size.unit}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {property.location?.address || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={
                          "inline-block rounded-full px-3 py-1 text-xs font-semibold " +
                          (property.status === "approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-700/20 dark:text-green-300"
                            : property.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700/20 dark:text-yellow-300"
                              : property.status === "rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-700/20 dark:text-red-300"
                                : "bg-neutral-100 text-neutral-800 dark:bg-neutral-700/20 dark:text-neutral-300")
                        }
                      >
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/broker/listings/edit/${property._id}`}
                          className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                        >
                          <Edit2 size={16} /> Edit
                        </Link>
                        {/* <button
                          onClick={() => setDeleteConfirm(city)}
                          className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                        >
                          <Trash2 size={16} /> Delete
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center p-4">
            <p className="text-sm font-medium">
              Showing{" "}
              <span className="font-medium">
                {properties.length}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {total}
              </span>{" "}
              properties
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg hover:bg-neutral-400 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
              >
                <ArrowLeft size={16} />Previous
              </button>
              <span className="px-4 py-2 font-medium">
                Page {page} of {Math.ceil(total / limit)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / limit)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg hover:bg-neutral-400 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
              >
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </BrokerLayout>
  );
}
