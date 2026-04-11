import { useEffect, useState } from "react";
import { adminService } from "../services/apiService";
import AdminLayout from "../components/AdminLayout";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminListingsPending() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchPendingListings();
  }, [page]);

  const fetchPendingListings = async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      const response = await adminService.getPendingListings(params);
      setProperties(response.data.properties);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch pending listings:", error);
      toast.error("Failed to fetch pending listings");

      // You may use a toast here if desired
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this listing?")) return;
    try {
      await adminService.updatePropertyStatus(id, { status: "approved" });
      setProperties(properties.filter((p) => p._id !== id));
      setTotal(total - 1);
      // You may use a toast here if desired
    } catch (error) {
      // You may use a toast here if desired
      toast.error("Failed to approve listing");
    }
  };

  const handleReject = async (id) => {
    const message = prompt("Enter the reason for rejecting the listing");
    if (!message) return;
    try {
      await adminService.updatePropertyStatus(id, { status: "rejected", rejectionReason: message });
      toast.success("Listing rejected successfully");
      setProperties(properties.filter((p) => p._id !== id));
      setTotal(total - 1);
      // You may use a toast here if desired
    } catch (error) {
      // You may use a toast here if desired
      toast.error("Failed to reject listing");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-64">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-neutral-300 dark:border-neutral-600 border-t-[#E8413B] rounded-full"></div>
          <p className="mt-4">
            Loading pending listings...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Pending Property Listings
        </h1>
        <p className="text-sm">
          Review new property listings and approve or reject them.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-neutral-200 dark:border-neutral-700 border-t-[#E8413B] rounded-full mb-4"></div>
            <p className="font-medium">
              Loading listings...
            </p>
          </div>
        </div>
      ) : properties.length === 0 ? (
        <div className="flex items-center justify-center">
          <p className="text-lg font-medium">No pending property listings</p>
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
                    Price
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
                {properties.map((property) => (
                  <tr
                    key={property._id}
                    className="bg-white dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium line-clamp-2 max-w-[240px]">
                      {property.title}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      Rs. {property.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {property.broker?.name}
                    </td>
                    <td className="px-6 py-4">
                      {property.city.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : ""}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(property._id)}
                          className="flex items-center cursor-pointer gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          <CheckCircle size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(property._id)}
                          className="flex items-center cursor-pointer gap-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          <XCircle size={16} />
                          Reject
                        </button>
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
              pending listings
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
    </AdminLayout>
  );
}
