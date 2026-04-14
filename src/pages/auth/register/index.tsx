import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/src/contexts/index.tsx";
import { useAuth } from "@/src/contexts/authContext";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
  BarChart3,
} from "lucide-react";
import { motion } from "motion/react";
// import { cn } from '../../lib/utils.ts';

export default function RegisterPage() {
  const { tokens } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate registration
    setTimeout(() => {
      login({
        access_token: "123456",
        refresh_token: "789012",
        user: {
          id: "123",
          name: "Priyanshu",
          email: "priyanshu@example.com",
          role: "Superuser",
        },
      });
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: tokens.bg }}
    >
      <div className="w-full max-w-md">
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
            Create Account
          </h1>
          <p className="text-sm mt-2" style={{ color: tokens.textSec }}>
            Join InquiryHub to start distributing inquiries.
          </p>
        </motion.div>

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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                className="text-sm font-bold px-1"
                style={{ color: tokens.text }}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: tokens.textMuted }}
                />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                  style={{
                    backgroundColor: tokens.bg,
                    borderColor: tokens.border,
                    color: tokens.text,
                  }}
                />
              </div>
            </div>

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
              <label
                className="text-sm font-bold px-1"
                style={{ color: tokens.text }}
              >
                Password
              </label>
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
              <p
                className="text-[10px] px-1"
                style={{ color: tokens.textMuted }}
              >
                Must be at least 8 characters with 1 number and 1 special
                character.
              </p>
            </div>

            <div className="flex items-start gap-2 px-1">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="terms"
                className="text-xs font-medium leading-relaxed"
                style={{ color: tokens.textSec }}
              >
                I agree to the{" "}
                <Link
                  to="#"
                  className="font-bold hover:underline"
                  style={{ color: tokens.accent }}
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="#"
                  className="font-bold hover:underline"
                  style={{ color: tokens.accent }}
                >
                  Privacy Policy
                </Link>
                .
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
                  Create Account
                  <UserPlus size={18} />
                </>
              )}
            </button>
          </form>

          <div
            className="mt-8 pt-6 border-t text-center"
            style={{ borderColor: tokens.border }}
          >
            <p className="text-sm" style={{ color: tokens.textSec }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold hover:underline"
                style={{ color: tokens.accent }}
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-bold hover:underline"
            style={{ color: tokens.textMuted }}
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
