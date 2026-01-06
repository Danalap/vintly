"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import { adminLogin } from "@/lib/admin-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = adminLogin(email, password);
    
    if (success) {
      router.push("/admin");
    } else {
      setError("Invalid email or password");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-display text-3xl font-semibold text-cream-50">
              vintly
            </span>
          </Link>
          <p className="mt-2 text-cream-200/60 text-sm">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-cream-50 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 bg-charcoal-900 rounded-2xl flex items-center justify-center">
              <Lock className="w-7 h-7 text-cream-50" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-charcoal-900">
              Admin Login
            </h1>
            <p className="mt-1 text-sm text-charcoal-700/60">
              Sign in to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
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
                  placeholder="admin@vintly.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 transition-colors"
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
                  className="w-full pl-12 pr-12 py-3 bg-sand-50 border border-cream-300 rounded-xl text-charcoal-800 placeholder:text-charcoal-700/40 focus:outline-none focus:border-charcoal-800 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-700/40 hover:text-charcoal-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-charcoal-900 text-cream-50 font-medium rounded-xl hover:bg-charcoal-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-cream-50/30 border-t-cream-50 rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-sand-100 rounded-xl">
            <p className="text-xs text-charcoal-700/60 mb-2">Demo Credentials:</p>
            <p className="text-sm text-charcoal-800">
              <span className="text-charcoal-700/60">Email:</span> admin@vintly.com
            </p>
            <p className="text-sm text-charcoal-800">
              <span className="text-charcoal-700/60">Password:</span> admin123
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-cream-200/60 hover:text-cream-50 text-sm transition-colors"
          >
            ← Back to Vintly
          </Link>
        </div>
      </div>
    </div>
  );
}






