import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye, EyeOff, Loader,
} from "lucide-react";
import { authService } from "../services/apiService";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name.trim()) {
      toast.error("Name is required");
      setLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    if (!agreedToTerms) {
      toast.error("You must agree to terms and conditions");
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      toast.success("Account created! Please check your email to verify your account.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="">
          <h1 className="text-xl text-center font-bold mb-6">Create Account</h1>
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
                className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                placeholder="Your full name"
              />
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
                className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                placeholder="your@email.com"
              />
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
                  className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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
                  className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 rounded accent-[#E8413B] cursor-pointer mt-0.5"
              />
              <label htmlFor="terms" className="text-xs text-neutral-500 dark:text-neutral-400 cursor-pointer leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-orange-500 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a>
              </label>
            </div>

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