import { useEffect, useState } from "react";
import { adminService } from "../services/apiService";
import AdminLayout from "../components/AdminLayout";
import { Mail, Phone } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers({ page, limit: 15 });
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change user role to ${newRole}?`)) return;

    try {
      await adminService.updateUserRole(userId, { role: newRole });
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );
      alert("User role updated!");
    } catch (error) {
      alert("Failed to update user role");
    }
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Manage Users</h1>
        <p className="text-sm">
          View and manage all users on the platform. Change roles and verify
          accounts.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-neutral-200 dark:border-neutral-700 border-t-orange-500 rounded-full mb-4"></div>
            <p className="font-medium">Loading users...</p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-x-auto bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
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
                  Role
                </th>
                {/*  <th scope="col" className="px-6 py-4">
                  Status
                </th> */}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="bg-white dark:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors duration-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {user.name}
                  </th>
                  <td className="px-6 py-4 ">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 dark:bg-purple-900/60"
                          : user.role === "broker"
                            ? "bg-blue-100 dark:bg-blue-900/60"
                            : "bg-neutral-100 dark:bg-neutral-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        user.isVerified
                          ? "bg-green-100 dark:bg-green-900/60"
                          : "bg-yellow-100 dark:bg-yellow-900/60"
                      }`}
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {Math.ceil(total / 15) > 1 && (
            <div className="flex justify-center items-center gap-2 p-6 border-t border-neutral-100 dark:border-neutral-700">
              {Array.from(
                { length: Math.ceil(total / 15) },
                (_, i) => i + 1,
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    page === p
                      ? "bg-orange-500 text-white"
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
