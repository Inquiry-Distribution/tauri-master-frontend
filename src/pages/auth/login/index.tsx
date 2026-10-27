import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/src/contexts/index.tsx";
import { useAuth } from "@/src/contexts/authContext.tsx";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { motion } from "motion/react";
import { api } from "@/src/api/axios";
import Swal from "sweetalert2";
import {
  clearRememberedLogin,
  getRememberedLogin,
  setRememberedLogin,
} from "@/src/utils/rememberLogin";
// import { cn } from '../../lib/utils.ts'  ;

export default function LoginPage() {
  const { tokens } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const saved = getRememberedLogin();
  const [email, setEmail] = useState(saved.email);
  const [password, setPassword] = useState(saved.password);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Invalid email address";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, refreshToken, user } = res.data.data;

      login({
        access_token: token,
        refresh_token: refreshToken,
        user,
      });

      if (rememberMe) setRememberedLogin(email, password);
      else clearRememberedLogin();

      navigate("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";

      // Dynamic backend errors
      if (message.toLowerCase().includes("email")) {
        setErrors((prev) => ({
          ...prev,
          email: message,
        }));
      } else if (message.toLowerCase().includes("password")) {
        setErrors((prev) => ({
          ...prev,
          password: message,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: message,
        }));
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message,
      });

      console.error("Login failed", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await handleLogin();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: tokens.bg }}
    >
      <div className="w-full max-w-md">
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-4">
            <BarChart3 size={32} />
          </div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ color: tokens.text }}
          >
            Welcome Back
          </h1>
          <p className="text-sm mt-2" style={{ color: tokens.textSec }}>
            Please enter your details to sign in.
          </p>
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl border shadow-2xl shadow-blue-500/5"
          style={{
            backgroundColor: tokens.surface,
            borderColor: tokens.border,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-4">
              <BarChart3 size={32} />
            </div>
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ color: tokens.text }}
            >
              Welcome Back
            </h1>
            <p className="text-sm mt-2" style={{ color: tokens.textSec }}>
              Please enter your details to sign in.
            </p>
          </motion.div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                className="text-sm font-bold px-1"
                style={{ color: tokens.text }}
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: tokens.textMuted }}
                />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                  style={{
                    backgroundColor: tokens.bg,
                    borderColor: errors.email ? "#ef4444" : tokens.border,
                    color: tokens.text,
                  }}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    // Clear error while typing
                    setErrors((prev) => ({
                      ...prev,
                      email: "",
                      general: "",
                    }));
                  }}
                />

                {errors.email && (
                  <p className="text-red-500 text-xs px-1 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label
                  className="text-sm font-bold"
                  style={{ color: tokens.text }}
                >
                  Password
                </label>
                {/* <Link
                  to="/forgot-password"
                  title="Forgot Password"
                  style={{ color: tokens.accent }}
                  className="text-xs font-bold hover:underline"
                >
                  Forgot Password?
                </Link> */}
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: tokens.textMuted }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    setErrors((prev) => ({
                      ...prev,
                      password: "",
                      general: "",
                    }));
                  }}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                  style={{
                    backgroundColor: tokens.bg,
                    borderColor: errors.password ? "#ef4444" : tokens.border,
                    color: tokens.text,
                  }}
                />

                {errors.password && (
                  <p className="text-red-500 text-xs px-1 mt-1">
                    {errors.password}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-opacity-10"
                  style={{ color: tokens.textMuted }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="text-xs font-medium"
                style={{ color: tokens.textSec }}
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <LogIn size={18} />
                </>
              )}
            </button>
            {errors.general && (
              <p className="text-red-500 text-sm text-center">
                {errors.general}
              </p>
            )}
          </form>

          {/* <div
            className="mt-8 pt-6 border-t text-center"
            style={{ borderColor: tokens.border }}
          >
            <p className="text-sm" style={{ color: tokens.textSec }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold hover:underline"
                style={{ color: tokens.accent }}
              >
                Create an account
              </Link>
            </p>
          </div> */}
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-xs" style={{ color: tokens.textMuted }}>
            &copy; 2026 InquiryHub Distribution System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
