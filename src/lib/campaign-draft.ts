// src/lib/campaign-draft.ts

export interface CampaignDraft {
  // Step 1
  campaign_name: string;
  property_id: string;
  property_name: string;
  property_location: string;
  property_price_range: string;
  property_type: string;
  property_developer: string;
  property_bedrooms: string;
  property_completion_date: string;
  property_amenities: string[];
  property_description: string;
  pdf_file_name: string;

  // Step 2
  lead_list_id: string;
  lead_list_name: string;
  lead_list_file_name: string;
  total_leads: number;
  valid_leads: number;
  invalid_leads: number;
}

const DRAFT_KEY = "campaign_draft";

export const campaignDraft = {
  save(data: Partial<CampaignDraft>): void {
    const existing = campaignDraft.get();
    const merged = { ...existing, ...data };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(merged));
  },

  get(): Partial<CampaignDraft> {
    if (typeof window === "undefined") return {};
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  },

  clear(): void {
    sessionStorage.removeItem(DRAFT_KEY);
  },
};