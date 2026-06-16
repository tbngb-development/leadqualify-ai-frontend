// src/app/(auth)/register/page.tsx

import { RegisterForm } from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Register — LeadAI" };

export default function RegisterPage() {
  return <RegisterForm />;
}
