// src/components/layout/Sidebar.tsx

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  Megaphone,
  PhoneCall,
  ChevronLeft,
  Leaf,
} from "lucide-react";
import { ADMIN_ROUTES } from "@/constants/routes/admin.routes";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: "Dashboard", href: ADMIN_ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Properties", href: ADMIN_ROUTES.PROPERTIES, icon: Building2 },
  { label: "Leads", href: ADMIN_ROUTES.LEADS, icon: Users },
  { label: "Campaigns", href: ADMIN_ROUTES.CAMPAIGNS, icon: Megaphone },
  { label: "Call Results", href: ADMIN_ROUTES.RESULTS, icon: PhoneCall },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  return (
    <aside
      className={`
        flex flex-col h-full bg-surface border-r border-surface-border
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-[240px]"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-surface-border shrink-0">
        <div className="flex items-center justify-center w-8 h-8 bg-brand-500 rounded-lg shrink-0">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold text-text-primary truncate animate-slide-in">
            LeadQualify
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto no-scrollbar">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium
                transition-colors duration-150 group relative
                ${
                  active
                    ? "bg-brand-50 text-brand-600"
                    : "text-text-muted hover:bg-surface-hover hover:text-text-primary"
                }
              `}
            >
              <Icon
                className={`w-[18px] h-[18px] shrink-0 ${
                  active
                    ? "text-brand-600"
                    : "text-text-muted group-hover:text-text-secondary"
                }`}
              />
              {!collapsed && (
                <span className="truncate animate-slide-in">{label}</span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2.5 px-2.5 py-1.5 bg-text-primary text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 shadow-md">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-surface-border p-2.5 shrink-0">
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full h-9 rounded-lg text-text-muted hover:bg-surface-hover hover:text-text-primary transition-colors duration-150 cursor-pointer"
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </aside>
  );
}
