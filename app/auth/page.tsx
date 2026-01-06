"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Check,
} from "lucide-react";
import { signIn, signUp } from "@/lib/user-store";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (mode === "signup") {
      // Validation
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      const result = signUp(name, email, password);
      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Failed to create account");
      }
    } else {
      const result = signIn(email, password);
      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Failed to sign in");
      }
    }

    setIsLoading(false);
  };

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-charcoal-700 hover:text-charcoal-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Vintly</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-semibold text-charcoal-900">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h1>
            <p className="mt-2 text-charcoal-700/70">
              {mode === "signin"
                ? "Sign in to your account to continue"
                : "Join the Vintly community"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {/* Name (signup only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-charcoal-800 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-700/40" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-charcoal-800 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-700/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-charcoal-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-700/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-700/40 hover:text-charcoal-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password (signup only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-charcoal-800 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-700/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Forgot Password (signin only) */}
            {mode === "signin" && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-terracotta-500 hover:text-terracotta-600 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-charcoal-900 text-cream-50 font-medium rounded-xl hover:bg-charcoal-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-cream-50/30 border-t-cream-50 rounded-full animate-spin" />
                  {mode === "signin" ? "Signing in..." : "Creating account..."}
                </>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-cream-300" />
            <span className="text-sm text-charcoal-700/50">or</span>
            <div className="flex-1 h-px bg-cream-300" />
          </div>

          {/* Social Login Placeholder */}
          <button className="w-full py-3.5 bg-white border border-cream-300 text-charcoal-800 font-medium rounded-xl hover:bg-sand-50 transition-colors flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Switch Mode */}
          <p className="mt-8 text-center text-sm text-charcoal-700/70">
            {mode === "signin" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={switchMode}
                  className="text-terracotta-500 hover:text-terracotta-600 font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={switchMode}
                  className="text-terracotta-500 hover:text-terracotta-600 font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Right Panel - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-charcoal-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative text-center max-w-md">
          <span className="font-display text-5xl font-semibold text-cream-50">
            vintly
          </span>
          <p className="mt-4 text-xl text-cream-200/80">
            The Haute Couture Resale Destination
          </p>
          <div className="mt-12 space-y-4">
            {[
              "Access exclusive designer pieces",
              "Buy and sell with confidence",
              "Join a community of collectors",
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-cream-200/70"
              >
                <div className="w-6 h-6 rounded-full bg-sage-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
