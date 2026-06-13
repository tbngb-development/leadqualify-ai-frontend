// src/app/admin/(protected)/campaigns/page.tsx

import CampaignsListClient from "./CampaignsListClient";

export const metadata = {
  title: "Campaigns | LeadQualify AI",
};

export default function CampaignsPage() {
  return <CampaignsListClient />;
}