import { useAuth } from '../hooks/useAuth';
import { Mail, Phone, Building2, MapPin, Edit, Verified } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (!user && !loading) {
    return (
      <Navigate to="/login" replace />
    )
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <button
            onClick={() => navigate('/settings')}
            className="flex cursor-pointer items-center gap-2 bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg transition"
          >
            <Edit size={18} />
            Edit
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-lg p-8">
          {/* Profile Picture and Name */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-700">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
              <p className="text-sm font-medium capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-primary" />
              <div>
                <p className="text-xs">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>

            {/* Phone */}
            {user?.phone && (
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-primary" />
                <div>
                  <p className="text-xs">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Broker Details */}
          {user?.role === 'broker' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Professional Information</h3>

              {/* Company */}
              {user?.company && (
                <div className="flex items-center gap-3">
                  <Building2 size={20} className="text-primary" />
                  <div>
                    <p className="text-xs">Company</p>
                    <p className="font-medium">{user.company}</p>
                  </div>
                </div>
              )}

              {/* City */}
              {user?.city && (
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-primary" />
                  <div>
                    <p className="text-xs">City</p>
                    <p className="font-medium">{user.city}</p>
                  </div>
                </div>
              )}

              {/* Verification Status */}
              <div className="flex items-center gap-3 pt-4">
                <Verified size={20} className="text-primary" />
                <div>
                  <p className="text-xs">Verification Status</p>
                  <p className={`text-sm font-medium ${user?.isBrokerVerified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {user?.isBrokerVerified ? 'Verified' : 'Pending Verification'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
