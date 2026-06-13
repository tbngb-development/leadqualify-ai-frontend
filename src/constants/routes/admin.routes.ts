// src/constants/routes/admin.routes.ts

export const ADMIN_ROUTES = {
  DASHBOARD: "/admin/dashboard",
  PROPERTIES: "/admin/properties",
  PROPERTIES_UPLOAD: "/admin/properties/upload",
  LEADS: "/admin/leads",
  LEADS_UPLOAD: "/admin/leads/upload",

  // Campaigns
  CAMPAIGNS: "/admin/campaigns",
  CAMPAIGNS_CREATE: "/admin/campaigns/create",
  CAMPAIGNS_CREATE_LEADS: "/admin/campaigns/create/leads",
  CAMPAIGNS_CREATE_REVIEW: "/admin/campaigns/create/review", // ← NEW
  CAMPAIGN_DETAIL: (id: string) => `/admin/campaigns/${id}`,
  
  RESULTS: "/admin/results",
  RESULT_DETAIL: (id: string) => `/admin/results/${id}`,

  SETTINGS: "/admin/settings",
  LOGIN: "/admin/login",
} as const;
