// src/hooks/useAuth.ts

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import type { LoginInput, RegisterInput } from "@/types";

// Helper — sync auth cookies for middleware
function setAuthCookies(token: string, role: string) {
  // Secure, SameSite cookies readable by middleware (edge runtime)
  document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  document.cookie = `auth-role=${role}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearAuthCookies() {
  document.cookie = "auth-token=; path=/; max-age=0";
  document.cookie = "auth-role=; path=/; max-age=0";
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.token, data.user, data.tenant);
      setAuthCookies(data.token, data.user.role);
      toast.success(`Welcome back, ${data.user.name}!`);
      if (data.user.role === "SUPER_ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: Error) => {
      console.log("admin login error:  ", error);
      toast.error(error.message);
    },
  });
}

export function useAdminLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (data) => {
      if (data.user.role !== "SUPER_ADMIN") {
        toast.error("Not authorized. Super admin access required.");
        return;
      }
      setAuth(data.token, data.user, data.tenant);
      setAuthCookies(data.token, data.user.role);
      toast.success("Welcome, Super Admin!");
      router.push("/admin/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (data) => {
      setAuth(data.token, data.user, data.tenant);
      setAuthCookies(data.token, data.user.role);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return () => {
    clearAuth();
    clearAuthCookies();
    toast.success("Logged out successfully");
    router.push("/login");
  };
}

export function useAdminLogout() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return () => {
    clearAuth();
    clearAuthCookies();
    router.push("/admin/login");
  };
}
