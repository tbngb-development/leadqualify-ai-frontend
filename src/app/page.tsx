// src/app/page.tsx

import { redirect } from "next/navigation";
import { USER_ROUTES } from "@/constants/routes/user.routes";

export default function RootPage() {
  redirect(USER_ROUTES.LOGIN);
}
