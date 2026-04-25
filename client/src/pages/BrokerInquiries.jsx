import { useEffect, useState } from "react";
import { Mail, Phone, ArrowLeft, ArrowRight } from "lucide-react";
import BrokerLayout from "../components/BrokerLayout";
import { inquiryService } from "../services/apiService";
import { Link } from "react-router-dom";

export default function BrokerInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchInquiries();
  }, [page]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await inquiryService.getBrokerInquiries({
        page,
        limit,
      });
      setInquiries(response.data.inquiries || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BrokerLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Inquiry Requests</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Review buyer and renter messages for your listings.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-neutral-300 dark:border-neutral-600 border-t-[#E8413B] rounded-full mb-4" />
            <p className="font-medium">Loading inquiries...</p>
          </div>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="flex items-center justify-center dark:bg-orange-900/10 bg-orange-50 p-6 rounded-lg">
          <p className="text-lg font-medium">No inquiries found.</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 uppercase tracking-wide font-medium">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Meeting Date
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Message
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Received
                  </th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="">
                    <td className="px-6 py-4 align-top">
                      <Link
                        to={`/listings/${inquiry.property._id}`}
                        className="font-medium hover:text-blue-500 hover:underline"
                      >
                        {inquiry.property?.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 align-top text-sm">
                      <div className="font-medium">
                        {inquiry.client?.name || "Unknown Client"}
                      </div>
                      {inquiry.client?.email && (
                        <div className="text-xs mt-1">
                          {inquiry.client.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top text-sm">
                      <div className="flex flex-col gap-2">
                        {inquiry.client?.email ? (
                          <a
                            href={`mailto:${inquiry.client.email}`}
                            className="inline-flex items-center gap-2 text-primary dark:text-secondary hover:underline"
                          >
                            <Mail size={14} />
                            Email
                          </a>
                        ) : (
                          <span className="italic">-</span>
                        )}
                        {inquiry.client?.phone ? (
                          <a
                            href={`tel:${inquiry.client.phone}`}
                            className="inline-flex items-center gap-2 text-primary dark:text-secondary hover:underline"
                          >
                            <Phone size={14} />
                            Phone
                          </a>
                        ) : (
                          <span className="italic">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-sm">
                      {inquiry.preferredMeetingDate
                        ? new Date(
                            inquiry.preferredMeetingDate,
                          ).toLocaleDateString()
                        : "Not selected"}
                    </td>
                    <td className="px-6 py-4 align-top text-sm">
                      <p className="max-w-md text-neutral-700 dark:text-neutral-300">
                        {inquiry.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 align-top text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {Math.ceil(total / limit) > 1 && (
            <div className="mt-6 flex justify-between items-center p-4">
              <p className="text-sm font-medium">
                Showing <span className="font-medium">{inquiries.length}</span>{" "}
                of <span className="font-medium">{total}</span> inquiries
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg hover:bg-neutral-400 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>
                <span className="px-4 py-2 font-medium">
                  Page {page} of {Math.ceil(total / limit)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / limit)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-300 dark:bg-neutral-700 rounded-lg hover:bg-neutral-400 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors duration-200"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </BrokerLayout>
  );
}
