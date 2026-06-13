// src/app/admin/(auth)/login/LoginClient.tsx

"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import { ADMIN_ROUTES } from "@/constants/routes/admin.routes";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("auth_token") === "authenticated"
    ) {
      router.replace(ADMIN_ROUTES.DASHBOARD);
    }
  }, [router]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    await new Promise((r) => setTimeout(r, 1200));

    // Mock credentials check
    if (email === "admin@leadqualify.ai" && password === "password") {
      // Set session
      sessionStorage.setItem("auth_token", "authenticated");
      sessionStorage.setItem("user_email", email);
      router.push(ADMIN_ROUTES.DASHBOARD);
    } else {
      setErrors({ general: "Invalid email or password. Please try again." });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── Left Panel (Form) ──────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-text-primary tracking-tight">
              LeadQualify
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-text-muted mt-1.5">
              Sign in to manage your AI calling campaigns
            </p>
          </div>

          {/* Error Banner */}
          {errors.general && (
            <div className="mb-6 flex items-center gap-2.5 px-4 py-3 bg-error-50 border border-error-100 rounded-xl">
              <div className="w-5 h-5 rounded-full bg-error-100 flex items-center justify-center shrink-0">
                <span className="text-error-500 text-xs font-bold">!</span>
              </div>
              <p className="text-sm text-error-600">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-primary"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-placeholder" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@leadqualify.ai"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 text-sm text-text-primary bg-surface border rounded-lg placeholder:text-text-placeholder transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${errors.email ? "border-error-500" : "border-surface-border"}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-primary"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-placeholder" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((p) => ({ ...p, password: undefined }));
                  }}
                  className={`w-full pl-10 pr-11 py-2.5 text-sm text-text-primary bg-surface border rounded-lg placeholder:text-text-placeholder transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${errors.password ? "border-error-500" : "border-surface-border"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-text-placeholder hover:text-text-muted hover:bg-surface-hover transition-all cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error-500">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className={`flex items-center justify-center w-5 h-5 rounded border transition-all duration-150 cursor-pointer ${rememberMe ? "bg-brand-500 border-brand-500" : "border-surface-border hover:border-brand-300"}`}
              >
                {rememberMe && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <span className="text-sm text-text-muted">Remember me</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg shadow-xs transition-all duration-200 group ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-brand-600 cursor-pointer"}`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-3.5 bg-surface-muted border border-surface-border rounded-xl">
            <p className="text-xs font-medium text-text-muted mb-2">
              Demo Credentials
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted w-16">Email:</span>
                <code className="text-xs font-mono text-text-primary bg-surface px-1.5 py-0.5 rounded">
                  admin@leadqualify.ai
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted w-16">Password:</span>
                <code className="text-xs font-mono text-text-primary bg-surface px-1.5 py-0.5 rounded">
                  password
                </code>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-text-placeholder text-center">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="text-brand-500 hover:text-brand-600 font-medium"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-brand-500 hover:text-brand-600 font-medium"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* ─── Right Panel ───────────────────── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-1/4 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div />
          <div className="space-y-6">
            <div className="space-y-3">
              {[
                {
                  emoji: "📞",
                  title: "AI-Powered Calling",
                  desc: "Automatically call and qualify thousands of leads",
                },
                {
                  emoji: "🎯",
                  title: "Smart Qualification",
                  desc: "AI identifies hot, warm, and cold leads instantly",
                },
                {
                  emoji: "📊",
                  title: "Real-time Analytics",
                  desc: "Monitor campaigns and track results live",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 p-3.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10"
                >
                  <span className="text-lg shrink-0 mt-0.5">{item.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-white/70 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <p className="text-3xl font-bold tracking-tight">10,000+</p>
              <p className="text-sm text-white/70 mt-1">
                Leads qualified by our AI every month
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 pt-8">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-white/80">
              LeadQualify AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
