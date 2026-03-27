import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { authService } from "../services/apiService";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await authService.login(formData);
      login(response.data.token, response.data.user);

      // role-based routing
      if (response.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (response.data.user.role === "broker") {
        navigate("/broker/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response?.data?.message)
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo & Branding */}

        {/* Main Card */}
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-8 md:p-10">
          <h1 className="text-xl text-center font-bold mb-2">Login</h1>

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 dark:text-red-300 font-medium text-sm">
                  {errors.submit}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block font-semibold mb-2 text-sm">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8413B] focus:border-transparent text-sm transition"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="font-semibold text-sm">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8413B] focus:border-transparent text-sm transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 transition cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/60 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign In</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600"></div>
            <span className="text-xs">
              OR
            </span>
            <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-500 hover:underline font-semibold transition"
            >
              Create one
            </Link>
          </p>

          {/* Broker Link */}
          <p className="text-center text-sm mt-3">
            Are you a broker?{" "}
            <Link
              to="/join-as-broker"
              className="text-orange-500 hover:underline font-semibold transition"
            >
              Join now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
