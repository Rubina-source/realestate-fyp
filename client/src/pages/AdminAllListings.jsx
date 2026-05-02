import { useEffect, useState } from "react";
import { adminService } from "../services/apiService";
import AdminLayout from "../components/AdminLayout";
import { Mail, Phone, Trash2 } from "lucide-react";

export default function AdminAllListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 15;

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line
  }, [page]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllListings({ page, limit });
      setListings(response.data.properties || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this listing? This action cannot be undone.",
      )
    )
      return;

    try {
      await propertyService.delete(id);
      setProperties(properties.filter((p) => p._id !== id));
      alert("Listing deleted successfully!");
    } catch (error) {
      alert("Failed to delete listing");
    }
  };

  const handleMarkAsSoldOrAvailable = async (id, status) => {
    try {
      await adminService.updatePropertyStatus(id, { status });
      setListings((previous) =>
        previous.map((item) =>
          item._id === id ? { ...item, status } : item,
        ),
      );
    } catch (error) {
      alert(`Failed to mark property as ${status}`);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-2">All Listings</h1>
        <p className="text-sm">
          Browse and manage all property listings on the platform.
        </p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-neutral-200 dark:border-neutral-700 border-t-primary rounded-full mb-4"></div>
            <p className="font-medium">Loading listings...</p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-x-auto bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <table className="w-full text-sm text-left">
            <thead className="text-xs bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 uppercase tracking-wide font-medium">
              <tr>
                <th scope="col" className="px-6 py-4">
                  Title
                </th>
                <th scope="col" className="px-6 py-4">
                  Price
                </th>
                <th scope="col" className="px-6 py-4">
                  Status
                </th>
                <th scope="col" className="px-6 py-4">
                  Broker
                </th>
                <th scope="col" className="px-6 py-4">
                  City
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
              {listings.map((listing) => (
                <tr
                  key={listing._id}
                  className="bg-white dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {listing.title}
                  </th>
                  <td className="px-6 py-4">
                    {listing.price
                      ? `Rs. ${listing.price.toLocaleString()}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        listing.status === "approved"
                          ? "bg-green-100 dark:bg-green-900/60"
                          : listing.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-900/60"
                            : listing.status === "rejected"
                              ? "bg-red-100 dark:bg-red-900/60"
                              : "bg-neutral-100 dark:bg-neutral-700"
                      }`}
                    >
                      {listing.status}
                    </span>
                    {listing.status === "rejected" &&
                      listing.rejectionReason && (
                        <div className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                          {listing.rejectionReason}
                        </div>
                      )}
                  </td>

                  <td className="px-6 py-4">{listing.broker.name}</td>
                  <td className="px-6 py-4">{listing.city?.name || "-"}</td>
                  <td className="px-6 py-4 text-sm">
                    {listing.createdAt
                      ? new Date(listing.createdAt).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {(listing.status === "approved" ||
                        listing.status === "sold") && (
                        <button
                          onClick={() =>
                            handleMarkAsSoldOrAvailable(
                              listing._id,
                              listing.status === "approved"
                                ? "sold"
                                : "approved",
                            )
                          }
                          className={
                            "h-9 px-4 py-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center " +
                            (listing.status === "approved"
                              ? "bg-green-200 text-green-800 dark:bg-green-700/30 dark:text-green-300"
                              : "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary")
                          }
                          title={`Mark as ${listing.status === "approved" ? "sold" : "available"}`}
                        >
                          Mark as {listing.status === "approved" ? "sold" : "available"}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {Math.ceil(total / limit) > 1 && (
            <div className="flex justify-center items-center gap-2 p-6 border-t border-neutral-100 dark:border-neutral-700">
              {Array.from(
                { length: Math.ceil(total / limit) },
                (_, i) => i + 1,
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    page === p
                      ? "bg-primary text-white"
                      : "bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
