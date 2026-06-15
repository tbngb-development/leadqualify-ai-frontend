// src/types/index.ts

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export type CampaignStatus =
  | "DRAFT"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "FAILED";

export type LeadStatus =
  | "PENDING"
  | "CALLING"
  | "CALLED"
  | "QUALIFIED"
  | "NOT_QUALIFIED"
  | "NO_ANSWER"
  | "FAILED";

export type CallStatus =
  | "PENDING"
  | "CALLING"
  | "COMPLETED"
  | "FAILED"
  | "NO_ANSWER";

// ─── API Wrapper ──────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: PaginatedData<T>;
  message: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  createdAt: string;
}

// ─── Tenant ───────────────────────────────────────────────────────────────────

export interface TenantCount {
  users: number;
  campaigns: number;
  leads: number;
  calls: number;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  isActive: boolean;
  createdAt: string;
  _count: TenantCount;
}

export interface TenantStats {
  tenant: Tenant;
  stats: {
    totalLeads: number;
    qualifiedLeads: number;
    totalCalls: number;
    completedCalls: number;
    activeCampaigns: number;
    qualificationRate: number;
  };
}

// ─── Assistant ────────────────────────────────────────────────────────────────

export interface AssistantConfig {
  voice?: {
    provider: string;
    voiceId: string;
  };
  [key: string]: unknown;
}

export interface Assistant {
  id: string;
  vapiId: string;
  name: string;
  tenantId: string;
  config: AssistantConfig;
  firstMessage?: string;
  systemPrompt?: string;
  createdAt: string;
}

export interface CreateAssistantInput {
  name: string;
  firstMessage: string;
  systemPrompt: string;
  voice?: {
    provider: string;
    voiceId: string;
  };
}

export type UpdateAssistantInput = Partial<CreateAssistantInput>;

// ─── Campaign ─────────────────────────────────────────────────────────────────

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  assistantId: string;
  totalLeads: number;
  calledLeads: number;
  successLeads: number;
  failedLeads: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  assistant: {
    name: string;
  };
}

export interface CampaignStats {
  totalLeads: number;
  calledLeads: number;
  successLeads: number;
  failedLeads: number;
  pendingLeads: number;
  qualificationRate: number;
  completionRate: number;
}

export interface CreateCampaignInput {
  name: string;
  description?: string;
  assistantId: string;
}

export type UpdateCampaignInput = Partial<CreateCampaignInput>;

export interface UploadResult {
  imported: number;
  invalid: number;
  total: number;
  errors?: string[];
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  status: LeadStatus;
  campaignId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  campaign: {
    name: string;
  };
}

export interface LeadDetail extends Lead {
  calls: Call[];
}

// ─── Call ─────────────────────────────────────────────────────────────────────

export interface Call {
  id: string;
  vapiCallId?: string;
  leadId: string;
  campaignId: string;
  status: CallStatus;
  duration?: number;
  recording?: string;
  transcript?: string;
  summary?: string;
  outcome?: string;
  startedAt?: string;
  endedAt?: string;
  lead: {
    name: string;
    phone: string;
  };
  campaign: {
    name: string;
  };
}

export interface TranscriptMessage {
  role: "assistant" | "user";
  message: string;
  time?: number;
  endTime?: number;
  duration?: number;
  secondsFromStart?: number;
}

export type CallOutcome = "QUALIFIED" | "NOT_QUALIFIED" | "CALLED";

export interface CallTranscriptResponse {
  transcript: string | null;
  transcriptMessages: TranscriptMessage[];
  summary: string | null;
  outcome: CallOutcome | null;
  duration: number | null;
  recording: string | null;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardOverview {
  campaigns: {
    total: number;
    active: number;
  };
  leads: {
    total: number;
    qualified: number;
    notQualified: number;
    qualificationRate: number; // always a number
  };
  calls: {
    total: number;
    completed: number;
    failed: number;
    successRate: number; // always a number
  };
}

export interface ActivityItem {
  id: string;
  type:
    | "call_completed"
    | "lead_qualified"
    | "campaign_started"
    | "campaign_completed";
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface DashboardCampaign {
  id: string;
  name: string;
  status: CampaignStatus;
  assistant: string;
  totalLeads: number;
  calledLeads: number;
  successLeads: number;
  failedLeads: number;
  successRate: number;
  progress: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  tenantName: string;
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  tenant: {
    id: string;
    name: string;
    apiKey: string;
  };
}

// ─── Users (Team) ─────────────────────────────────────────────────────────────

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: "ADMIN" | "USER";
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface LeadQueryParams {
  campaignId?: string;
  status?: LeadStatus;
  page?: number;
  limit?: number;
  search?: string;
}

export interface CallQueryParams {
  campaignId?: string;
  leadId?: string;
  status?: CallStatus;
  page?: number;
  limit?: number;
}
