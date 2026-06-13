// src/components/layout/Header.tsx

"use client";

import { useRouter } from "next/navigation";
import { Bell, Search, LogOut } from "lucide-react";
import { ADMIN_ROUTES } from "@/constants/routes/admin.routes";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("user_email");
    router.push(ADMIN_ROUTES.LOGIN);
  };

  const userEmail =
    typeof window !== "undefined"
      ? sessionStorage.getItem("user_email") || "admin@leadqualify.ai"
      : "admin@leadqualify.ai";

  const initials = userEmail
    .split("@")[0]
    .split(/[._-]/)
    .map((w: string) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return (
    <header className="flex items-center justify-between h-14 px-6 bg-surface border-b border-surface-border shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 w-full max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-placeholder" />
          <input
            type="text"
            placeholder="Search campaigns, properties, leads..."
            className="w-full pl-9 pr-4 py-2 text-sm text-text-primary bg-surface-muted border border-surface-border rounded-lg placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-150"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative flex items-center justify-center w-9 h-9 rounded-lg text-text-muted hover:bg-surface-hover transition-colors cursor-pointer">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-surface-border" />

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
            <span className="text-xs font-bold text-brand-600">{initials}</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-text-primary leading-tight">
              Admin
            </p>
            <p className="text-xs text-text-muted leading-tight truncate max-w-[140px]">
              {userEmail}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:bg-surface-hover hover:text-error-500 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}