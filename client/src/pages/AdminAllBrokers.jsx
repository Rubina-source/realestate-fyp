import { useEffect, useState } from "react";
import { adminService } from "../services/apiService";
import AdminLayout from "../components/AdminLayout";
import toast from "react-hot-toast";

export default function AdminAllBrokers() {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchAllBrokers();
    // eslint-disable-next-line
  }, [page]);

  const fetchAllBrokers = async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      const response = await adminService.getAllBrokers(params);
      setBrokers(response.data.brokers);
      setTotal(response.data.total);
    } catch (error) {
      toast.error("Failed to load brokers");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-64">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-neutral-300 dark:border-neutral-600 border-t-[#E8413B] rounded-full"></div>
          <p className="mt-4">
            Loading all brokers...
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
          All Brokers
        </h1>
        <p className="text-sm">
          List of all brokers registered on the platform.
        </p>
      </div>

      {brokers.length === 0 ? (
        <div className="flex items-center justify-center dark:bg-green-900/20 p-6 rounded-lg">
          <p className="text-lg font-medium">No broker list</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 uppercase tracking-wide font-medium">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-4">
                    City
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {brokers.map((broker) => (
                  <tr
                    key={broker._id}
                    className="bg-white dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium">
                      {broker.name}
                    </td>
                    <td className="px-6 py-4">
                      {broker.email}
                    </td>
                    <td className="px-6 py-4">
                      {broker.phone || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {broker.company || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {broker.city?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${broker.isBrokerVerified
                            ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                            : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
                          }`}
                      >
                        {broker.isBrokerVerified ? "Verified" : "Pending"}
                      </span>
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
                {brokers.length}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {total}
              </span>{" "}
              brokers
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg hover:bg-neutral-400 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
              >
                Previous
              </button>
              <span className="px-4 py-2 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg hover:bg-neutral-400 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
