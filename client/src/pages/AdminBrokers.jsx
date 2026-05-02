import { useEffect, useState } from "react";
import { adminService } from "../services/apiService";
import AdminLayout from "../components/AdminLayout";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminBrokers() {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchPendingBrokers();
  }, [page]);

  const fetchPendingBrokers = async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      const response = await adminService.getPendingBrokers(params);
      setBrokers(response.data.brokers);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch pending brokers:", error);
      toast.error("Failed to load pending brokers");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (brokerId) => {
    if (!window.confirm("Verify this broker?")) return;
    try {
      await adminService.verifyBroker(brokerId);
      toast.success("Broker verified successfully!");
      setBrokers(brokers.filter((b) => b._id !== brokerId));
      setTotal(total - 1);
    } catch (error) {
      console.error("Failed to verify broker:", error);
      toast.error("Failed to verify broker");
    }
  };

  const handleReject = async (brokerId) => {
    if (!window.confirm("Reject this broker? They can reapply later.")) return;
    try {
      await adminService.rejectBroker(brokerId);
      toast.success("Broker rejected!");
      setBrokers(brokers.filter((b) => b._id !== brokerId));
      setTotal(total - 1);
    } catch (error) {
      console.error("Failed to reject broker:", error);
      toast.error("Failed to reject broker");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-64">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-neutral-300 dark:border-neutral-600 border-t-primary rounded-full"></div>
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
          Pending Broker Verification
        </h1>
        <p className="text-sm">
          Review new broker applications and verify or reject them.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-neutral-200 dark:border-neutral-700 border-t-primary rounded-full mb-4"></div>
            <p className="font-medium">
              Loading brokers...
            </p>
          </div>
        </div>
      ) : brokers.length === 0 ? (
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
                    ID Document
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Applied
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Actions
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
                    <td className="px-6 py-4 text-sm">
                      {broker.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {broker.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {broker.company || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {broker.city?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {broker.brokerIdDocument ? (
                        <a
                          href={broker.brokerIdDocument}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline font-medium"
                        >
                          View ID
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(broker.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerify(broker._id)}
                          className="flex items-center cursor-pointer gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded-md text-sm font-medium transition-colors duration-200"
                        >
                          <CheckCircle size={16} />
                          Verify
                        </button>
                        <button
                          onClick={() => handleReject(broker._id)}
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
                {brokers.length}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {total}
              </span>{" "}
              pending brokers
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
