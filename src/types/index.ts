

// ─── Enums ───────────────────────────────

export type ExtractionStatus = "pending" | "completed" | "failed";
export type LeadListStatus = "processing" | "ready" | "failed";
export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "failed";
export type CampaignLeadStatus = "pending" | "calling" | "completed" | "failed" | "skipped";
export type InterestLevel = "hot" | "warm" | "cold" | "not_interested";
export type CallStatus = "completed" | "no_answer" | "busy" | "failed" | "voicemail";
export type DocumentType = "fact_sheet" | "brochure" | "price_list" | "investment_sheet" | "other";

// ─── Property ────────────────────────────

export interface Property {
  id: string;
  name: string;
  document_type: DocumentType;
  file_name: string;
  file_url: string;
  file_size: number;
  description?: string;
  location?: string;
  price_range?: string;
  starting_price?: number;
  currency: string;
  property_type?: string;
  bedrooms?: string;
  amenities?: string[];
  developer?: string;
  completion_date?: string;
  roi_percentage?:number;
  rental_yield?:number;
  payment_plan?: Record<string, string>;
  extraction_status: ExtractionStatus;
  created_at: string;
  updated_at: string;
}

// ─── Lead ────────────────────────────────

export interface LeadList {
  id: string;
  name: string;
  file_name: string;
  total_count: number;
  valid_count: number;
  invalid_count: number;
  status: LeadListStatus;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  lead_list_id: string;
  first_name: string;
  last_name?: string;
  phone: string;
  email?: string;
  nationality?: string;
  budget?: string;
  notes?: string;
  is_valid: boolean;
  invalid_reason?: string;
  row_number: number;
  created_at: string;
}

// ─── Campaign ────────────────────────────

export interface Campaign {
  id: string;
  name: string;
  property_id: string;
  lead_list_id: string;
  property_name?: string;
  status: CampaignStatus;
  total_leads: number;
  calls_initiated: number;
  calls_completed: number;
  calls_failed: number;
  calls_pending: number;
  started_at?: string;
  completed_at?: string| null;
  created_at: string;
  updated_at: string;
}

// ─── Call Results ────────────────────────

export interface QualificationData {
  is_interested: boolean;
  requested_callback: boolean;
  budget_confirmed: boolean;
  timeline?: string;
  purpose?: string;
  objections: string[];
  key_questions: string[];
  summary: string;
}

export interface TranscriptTurn {
  role: "assistant" | "user";
  message: string;
  timestamp: number;
}

export interface CallResult {
  id: string;
  campaign_lead_id: string;
  campaign_id: string;
  lead_id: string;
  transcript?: string;
  transcript_json?: TranscriptTurn[];
  interest_level?: InterestLevel;
  qualification_score?: number;
  qualification_data?: QualificationData;
  call_status: CallStatus;
  end_reason?: string;
  recording_url?: string;
  created_at: string;
  updated_at: string;
}

// ─── Dashboard ───────────────────────────

export interface DashboardStats {
  total_campaigns: number;
  total_leads: number;
  calls_completed: number;
  calls_pending: number;
}

// ─── API ─────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}