import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  ArrowLeft,
  BadgeCheck,
} from "lucide-react";
import { propertyService } from "../services/apiService";
import PropertyCard from "../components/property/PropertyCard";
import { inquiryService } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function BrokerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [broker, setBroker] = useState(null);
  const [recentListings, setRecentListings] = useState([]);
  const [totalApprovedListings, setTotalApprovedListings] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchBrokerProfile = async () => {
      setLoading(true);
      try {
        const response = await propertyService.getPublicBrokerProfile(id, {
          limit: 3,
        });
        const payload = response?.data?.data;
        setBroker(payload?.broker || null);
        setRecentListings(payload?.recentListings || []);
        setTotalApprovedListings(payload?.totalApprovedListings || 0);
      } catch (error) {
        console.error("Failed to fetch broker profile:", error);
        setBroker(null);
        setRecentListings([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBrokerProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] max-w-6xl mx-auto px-4 md:px-12 py-14 flex items-center justify-center">
        <p className="text-sm">Loading broker profile...</p>
      </div>
    );
  }

  if (!broker) {
    return (
      <div className="min-h-[60vh] max-w-6xl mx-auto px-4 md:px-12 py-14">
        <Link
          to="/brokers"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-6"
        >
          <ArrowLeft size={16} />
          Back to Brokers
        </Link>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
          <h1 className="text-2xl font-bold mb-2">Broker Not Found</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            This broker is unavailable or no longer public.
          </p>
        </div>
      </div>
    );
  }

  const handleContactClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setContactOpen(true);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!contactMessage.trim()) return;

    try {
      setSending(true);
      await inquiryService.createBrokerInquiry({
        brokerId: broker._id,
        message: contactMessage.trim(),
      });
      toast.success("Message sent to broker.");
      setContactMessage("");
      setContactOpen(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send message.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-12 py-10">
        <Link
          to="/brokers"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-6"
        >
          <ArrowLeft size={16} />
          Back to Brokers
        </Link>

        <section className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={
                  broker.profileImage ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
                }
                alt={broker.name}
                className="w-20 h-20 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
              />
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  {broker.name}
                </h1>
                {broker.city?.name && (
                  <p className="text-sm inline-flex items-center gap-1">
                    {/* <MapPin size={14} className="text-primary" /> */}
                    {broker.city.name}
                  </p>
                )}
                {/* {broker.company && (
                  <div className="flex items-center gap-1">
                    <p className="text-sm inline-flex items-center gap-1">
                      <Building2 size={14} className="text-gray-700" />
                      {broker.company},
                    </p>
                    <p className="text-sm inline-flex items-center gap-1">
                      <Phone size={14} className="text-gray-700" />
                      {broker.phone},
                    </p>
                    <p className="text-sm inline-flex items-center gap-1">
                      <Mail size={14} className="text-gray-700" />
                      {broker.email}
                    </p>
                  </div>
                )} */}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleContactClick}
                className="cursor-pointer px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition"
              >
                Contact Broker
              </button>
            </div>

            {/*  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Listings
                </p>
                <p className="text-xl font-bold">{totalApprovedListings}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Primary City
                </p>
                <p className="text-xl font-bold">
                  {broker.city?.name || "N/A"}
                </p>
              </div>
            </div> */}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            {broker.company ? (
              <>
                {/* <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 text-sm flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                {broker.company}
              </div> */}
                <div className="flex items-center gap-3 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-3">
                  {/* <div className="h-8 w-8 shrink-0 rounded border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-200">
                    <Icon size={16} />
                  </div> */}
                  {/* <Icon size={16} /> */}
                  <Building2 />
                  <p className="text-lg text-neutral-800 dark:text-neutral-100 leading-tight">
                    {totalApprovedListings}
                  </p>
                </div>
              </>
            ) : null}
            {/*  {broker.phone ? (
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 text-sm flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                {broker.phone}
              </div>
            ) : null}
            {broker.email ? (
              <a
                href={`mailto:${broker.email}?subject=Property Inquiry`}
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 text-sm flex items-center gap-2 hover:border-primary transition"
              >
                <Mail size={16} className="text-primary" />
                {broker.email}
              </a>
            ) : null} */}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Listings</h2>
            <Link
              to={`/listings?keyword=${encodeURIComponent(broker.name)}`}
              className="text-sm font-medium text-primary"
            >
              Explore All Properties
            </Link>
          </div>

          {recentListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {recentListings.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 p-6 text-sm text-neutral-600 dark:text-neutral-300">
              No approved listings available for this broker yet.
            </div>
          )}
        </section>
      </div>

      {contactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">Message Broker</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
              Send a direct message to {broker.name}.
            </p>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <textarea
                rows={4}
                value={contactMessage}
                onChange={(event) => setContactMessage(event.target.value)}
                placeholder="Write your message..."
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setContactOpen(false)}
                  className="cursor-pointer px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || !contactMessage.trim()}
                  className="cursor-pointer px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-semibold disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
