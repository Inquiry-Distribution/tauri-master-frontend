import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/src/contexts/index.tsx";
import { Mail, ArrowLeft, BarChart3, CheckCircle2, Send } from "lucide-react";
import { motion } from "motion/react";

export default function ForgotPasswordPage() {
  const { tokens } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate email sending
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
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
            Reset Password
          </h1>
          <p className="text-sm mt-2" style={{ color: tokens.textSec }}>
            {isSubmitted
              ? "Check your email for reset instructions."
              : "Enter your email to receive a reset link."}
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
          {isSubmitted ? (
            <div className="text-center py-4 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 text-green-500 mb-2">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-2">
                <h3
                  className="text-xl font-bold"
                  style={{ color: tokens.text }}
                >
                  Email Sent!
                </h3>
                <p className="text-sm" style={{ color: tokens.textSec }}>
                  We've sent a password reset link to your email address. Please
                  check your inbox and spam folder.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full py-3.5 rounded-xl border font-bold hover:bg-opacity-10 transition-all"
                style={{ borderColor: tokens.border, color: tokens.text }}
              >
                Try another email
              </button>
            </div>
          ) : (
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
                  />
                </div>
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
                    Send Reset Link
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          <div
            className="mt-8 pt-6 border-t text-center"
            style={{ borderColor: tokens.border }}
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
              style={{ color: tokens.accent }}
            >
              <ArrowLeft size={16} />
              Back to sign in
            </Link>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-xs" style={{ color: tokens.textMuted }}>
            If you need further assistance, please contact{" "}
            <Link to="#" className="underline">
              Support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
