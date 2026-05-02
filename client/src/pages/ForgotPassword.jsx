import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { authService } from '../services/apiService';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const RESEND_COOLDOWN_SECONDS = 60;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setResendCooldown((previousSeconds) => {
        if (previousSeconds <= 1) {
          clearInterval(intervalId);
          return 0;
        }

        return previousSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [resendCooldown]);

  const handleRequestCode = async (e) => {
    e?.preventDefault();

    if (step === 2 && resendCooldown > 0) {
      return;
    }

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword({ email });
      toast.success(response.data.message);
      setStep(2);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.code || !formData.newPassword || !formData.confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword({
        email,
        code: formData.code,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="text-xl text-center font-bold mb-2">Forgot Password</h1>
        <p className="text-center text-sm mb-6">
          {step === 1
            ? 'Enter your email to receive a verification code.'
            : 'Enter the code from your email and set your new password.'}
        </p>

        {step === 1 ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2 text-sm">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-primary hover:bg-primary-dark disabled:bg-primary-dark/60 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                'Send verification code'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block font-semibold mb-2 text-sm">Verification Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                maxLength={6}
                className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                placeholder="6-digit code"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-sm">Confirm New Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="border text-sm px-3 py-2 rounded w-full bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-primary hover:bg-primary-dark disabled:bg-primary-dark/60 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Resetting password...
                </>
              ) : (
                'Reset password'
              )}
            </button>

            <button
              type="button"
              onClick={handleRequestCode}
              disabled={loading || resendCooldown > 0}
              className="w-full cursor-pointer border border-neutral-300 dark:border-neutral-700 rounded-lg py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
            </button>
          </form>
        )}

        <p className="text-center text-sm mt-6">
          Remembered your password?{' '}
          <Link to="/login" className="text-primary hover:underline font-semibold transition">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
