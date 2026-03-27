import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye, EyeOff, AlertCircle, Loader, User, Building2, CheckCircle,
} from "lucide-react";
import { authService } from "../services/apiService";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!agreedToTerms) newErrors.terms = "You must agree to terms and conditions";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      toast.success("Account created! Please check your email to verify your account.");
      navigate("/login");
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8413B] focus:border-transparent text-sm transition";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-8 md:p-10">
          <h1 className="text-xl text-center font-bold mb-6">Create Account</h1>

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-300 font-medium text-sm">
                {errors.submit}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block font-semibold mb-2 text-sm">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold mb-2 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold mb-2 text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-semibold mb-2 text-sm">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errors.terms) setErrors({ ...errors, terms: "" });
                }}
                className="w-4 h-4 rounded accent-[#E8413B] cursor-pointer mt-0.5"
              />
              <label htmlFor="terms" className="text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-orange-500 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-600 dark:text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.terms}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-orange-500 hover:bg-orange-400 disabled:bg-orange-500/60 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <><Loader className="w-4 h-4 animate-spin" />Creating account...</>
              ) : (
                <>Sign Up</>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600"></div>
            <span className="text-xs">OR</span>
            <div className="flex-1 h-px bg-neutral-300 dark:bg-neutral-600"></div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 hover:underline font-semibold transition">
              Sign in
            </Link>
          </p>

          {/* Broker Link */}
          <p className="text-center text-sm mt-3">
            Are you a broker?{" "}
            <Link to="/broker-signup" className="text-orange-500 hover:underline font-semibold transition">
              Join now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}