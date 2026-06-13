// src/app/admin/(protected)/leads/page.tsx

import LeadsManagementClient from "./LeadsManagementClient";

export const metadata = {
  title: "Leads | LeadQualify AI",
};

export default function LeadsPage() {
  return <LeadsManagementClient />;
}
