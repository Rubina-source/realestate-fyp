import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader,
  Trash,
  X,
} from "lucide-react";
import { authService, cityService } from "../services/apiService";
import { toast } from "react-hot-toast";

export default function BrokerSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [uploadingId, setUploadingId] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    company: "",
    city: "",
    role: "broker",
    brokerIdDocument: "",
  });

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        const response = await cityService.getAll();
        const cityList = response.data.data || [];
        setCities(cityList);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration missing");
    }

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formDataUpload,
      },
    );

    if (!response.ok) {
      throw new Error("Failed to upload document");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleIdUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingId(true);
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, brokerIdDocument: url }));
      toast.success("ID document uploaded successfully.");
    } catch (error) {
      const message = error?.message || "Failed to upload ID document.";
      toast.error(message);
    } finally {
      setUploadingId(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name.trim()) {
      setLoading(false);
      return toast.error("Name is required");
    }
    if (!formData.email.trim()) {
      setLoading(false);
      return toast.error("Email is required");
    }
    if (!formData.phone.trim()) {
      setLoading(false);
      return toast.error("Phone number is required");
    }
    if (!formData.company.trim()) {
      setLoading(false);
      return toast.error("Company name is required");
    }
    if (!formData.city) {
      setLoading(false);
      return toast.error("City is required");
    }
    if (!formData.brokerIdDocument) {
      setLoading(false);
      return toast.error("Please upload your ID document for verification");
    }
    if (formData.password.length < 6) {
      setLoading(false);
      return toast.error("Password must be at least 6 characters");
    }
    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      return toast.error("Passwords do not match");
    }
    if (!agreedToTerms) {
      setLoading(false);
      return toast.error("You must agree to terms and conditions");
    }

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
        company: formData.company,
        city: formData.city,
        role: formData.role,
        brokerIdDocument: formData.brokerIdDocument,
      };

      console.log("Submitting registration data:", registrationData);

      await authService.register(registrationData);
      toast.success(
        "Broker account created! Please check your email to verify your account. Admin verification is required to start listing properties.",
      );
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl">
        {/* Main Card */}
        <div className="p-8 md:p-10">
          {/* Header */}
          <h1 className="text-2xl md:text-3xl font-bold text-center text-[#1A1A2E] dark:text-white mb-2">
            Join as Broker
          </h1>
          <p className="text-center text-[#666666] dark:text-[#A0A0A0] mb-8">
            Create your professional broker account
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full"
            autoComplete="off"
          >
            {/* Personal Information */}
            <div className="space-y-4 pt-2">
              {/* Full Name */}
              <div>
                <label className="block font-semibold mb-2 text-sm">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                  placeholder="Your full name"
                  autoComplete="off"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#333333] dark:text-[#E5E5E5] font-semibold mb-2 text-sm">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                  placeholder="your@email.com"
                  autoComplete="off"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[#333333] dark:text-[#E5E5E5] font-semibold mb-2 text-sm">
                  Phone Number <span className="text-primary">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                  placeholder="98XXXXXXXXX"
                  autoComplete="off"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-[#333333] dark:text-[#E5E5E5] font-semibold mb-2 text-sm">
                  Company Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                  placeholder="Your real estate company"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Professional Details */}
            <div className="space-y-4 pt-4 ">
              {/* City */}
              <div>
                <label className="block text-[#333333] dark:text-[#E5E5E5] font-semibold mb-2 text-sm">
                  Operating City <span className="text-primary">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={citiesLoading}
                  className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                  autoComplete="off"
                >
                  <option value="">Select a city</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-sm">
                  Government ID <span className="text-primary">*</span>
                </label>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIdUpload}
                    disabled={uploadingId}
                    className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none disabled:opacity-60"
                  />
                  {uploadingId && (
                    <div className="flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 h-32 w-full">
                      <Loader className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  )}
                  {!uploadingId && formData.brokerIdDocument && (
                    <div className="rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2">
                      <div className="flex items-start justify-between gap-3">
                        <img
                          src={formData.brokerIdDocument}
                          alt="Uploaded ID"
                          className="h-32 w-full max-w-full rounded object-contain"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              brokerIdDocument: "",
                            }))
                          }
                          className="text-xs hover:text-red-800 flex items-center gap-1 text-red-500 cursor-pointer"
                        >
                          <Trash className="size-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Upload a clear photo of a government-issued ID.
                  </p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-4 pt-4 ">
              {/* Password */}
              <div>
                <label className="block text-[#333333] dark:text-[#E5E5E5] font-semibold mb-2 text-sm">
                  Password <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                    placeholder="••••••••"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-[#666666] dark:text-[#999999] hover:text-[#333333] dark:hover:text-[#E5E5E5] transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[#333333] dark:text-[#E5E5E5] font-semibold mb-2 text-sm">
                  Confirm Password <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                    placeholder="••••••••"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2 text-[#666666] dark:text-[#999999] hover:text-[#333333] dark:hover:text-[#E5E5E5] transition"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                  }}
                  className="w-4 h-4 border border-[#E0E0E0] dark:border-[#2E2E3E] rounded accent-primary cursor-pointer mt-0.5"
                  autoComplete="off"
                />
                <label
                  htmlFor="terms"
                  className="text-[#666666] dark:text-[#A0A0A0] text-xs cursor-pointer leading-relaxed flex-1"
                >
                  I agree to{" "}
                  <a
                    href="#"
                    className="text-primary hover:underline font-medium"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-primary hover:underline font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full cursor-pointer bg-primary hover:bg-primary-dark disabled:bg-primary-dark/50 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>Create Broker Account</>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-2 text-center text-sm">
            <p className="">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-semibold transition"
              >
                Sign in
              </Link>
            </p>
            <p className="">
              Looking to join as a regular user?{" "}
              <Link
                to="/signup"
                className="text-primary hover:underline font-semibold transition"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
