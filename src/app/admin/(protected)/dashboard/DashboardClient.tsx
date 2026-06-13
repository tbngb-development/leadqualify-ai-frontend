// src/app/admin/(protected)/dashboard/DashboardClient.tsx

"use client";

import { useRouter } from "next/navigation";
import {
  Megaphone,
  Users,
  PhoneCall,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";
import Card, { CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatCard from "@/components/dashboard/StatCard";
import CampaignTable from "@/components/dashboard/CampaignTable";
import { mockDashboardStats, mockRecentCampaigns } from "@/mocks/dashboard";
import { ADMIN_ROUTES } from "@/constants/routes/admin.routes";
import type { Campaign } from "@/types";

export default function DashboardClient() {
  const router = useRouter();
  const stats = mockDashboardStats;
  const campaigns = mockRecentCampaigns;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Overview of your AI calling campaigns
          </p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => router.push(ADMIN_ROUTES.CAMPAIGNS_CREATE)}
        >
          Create Campaign
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Campaigns"
          value={stats.total_campaigns}
          icon={<Megaphone className="w-5 h-5" />}
          iconBg="bg-brand-50"
          iconColor="text-brand-500"
          trend={{ value: 12, label: "vs last month", direction: "up" }}
        />
        <StatCard
          label="Total Leads"
          value={stats.total_leads}
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-info-50"
          iconColor="text-info-600"
          trend={{ value: 8, label: "vs last month", direction: "up" }}
        />
        <StatCard
          label="Calls Completed"
          value={stats.calls_completed}
          icon={<PhoneCall className="w-5 h-5" />}
          iconBg="bg-success-50"
          iconColor="text-success-600"
          trend={{ value: 23, label: "vs last month", direction: "up" }}
        />
        <StatCard
          label="Calls Pending"
          value={stats.calls_pending}
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-warning-50"
          iconColor="text-warning-600"
          trend={{ value: 5, label: "vs last month", direction: "down" }}
        />
      </div>

      {/* Recent Campaigns */}
      <Card padding="none">
        <div className="px-5 pt-5">
          <CardHeader
            title="Recent Campaigns"
            subtitle={`${campaigns.length} campaigns total`}
            action={
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
                onClick={() => router.push(ADMIN_ROUTES.CAMPAIGNS)}
              >
                View All
              </Button>
            }
          />
        </div>
        <CampaignTable
          campaigns={campaigns}
          onView={(campaign: Campaign) =>
            router.push(ADMIN_ROUTES.CAMPAIGN_DETAIL(campaign.id))
          }
        />
      </Card>
    </div>
  );
}
