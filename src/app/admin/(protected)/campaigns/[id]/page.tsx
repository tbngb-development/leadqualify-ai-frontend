// src/app/admin/(protected)/campaigns/[id]/page.tsx

import CampaignMonitorClient from "./CampaignMonitorClient";

export const metadata = {
  title: "Campaign Monitor | LeadQualify AI",
};

export default function CampaignMonitorPage() {
  return <CampaignMonitorClient />;
}