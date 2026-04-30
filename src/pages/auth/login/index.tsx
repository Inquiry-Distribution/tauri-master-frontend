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
// import { cn } from '../../lib/utils.ts'  ;

export default function LoginPage() {
  const { tokens } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (err: any) {
      let title = "Login failed";
      let text = "Something went wrong";
      let icon: "error" | "warning" = "error";

      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;

        if (status === 401) {
          title = "Invalid Credentials";
          text = message || "Email or password is incorrect.";
          icon = "warning";
        } else if (status === 403) {
          title = "Access Denied";
          text = message || "You are not allowed to login here.";
        } else {
          text = message || text;
        }
      } else if (err.request) {
        title = "Network Error";
        text = "Unable to reach server. Check your connection.";
      }

      Swal.fire({
        icon,
        title,
        text,
      });

      console.error("Login failed", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await handleLogin(); // ✅ wait
      navigate("/");
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
                    borderColor: tokens.border,
                    color: tokens.text,
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                  style={{
                    backgroundColor: tokens.bg,
                    borderColor: tokens.border,
                    color: tokens.text,
                  }}
                />
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

            {/* <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="remember"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="text-xs font-medium"
                style={{ color: tokens.textSec }}
              >
                Remember me for 30 days
              </label>
            </div> */}

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
