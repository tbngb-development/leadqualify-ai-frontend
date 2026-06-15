// src/app/(dashboard)/campaigns/new/page.tsx

'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { PageSpinner } from '@/components/ui/Spinner';
import { useCreateCampaign } from '@/hooks/useCampaigns';
import { useAssistants } from '@/hooks/useAssistants';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Campaign name must be at least 2 characters'),
  description: z.string().optional(),
  assistantId: z.string().min(1, 'Please select an assistant'),
});

type FormValues = z.infer<typeof schema>;

export default function NewCampaignPage() {
  const router = useRouter();
  const { data: assistants, isLoading: assistantsLoading } = useAssistants();
  const { mutate: create, isPending } = useCreateCampaign();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const assistantOptions =
    assistants?.map((a) => ({ value: a.id, label: a.name })) ?? [];

  const onSubmit = (data: FormValues) => {
    create(data, {
      onSuccess: (campaign) => router.push(`/campaigns/${campaign.id}`),
    });
  };

  if (assistantsLoading) return <PageSpinner />;

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      <div>
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-3 transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Campaigns
        </Link>
        <h2 className="text-lg font-semibold text-text-primary">
          Create Campaign
        </h2>
        <p className="text-sm text-text-muted mt-0.5">
          Set up a new outreach campaign
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-4">
            Campaign Details
          </h3>
          <div className="flex flex-col gap-4">
            <Input
              label="Campaign name"
              placeholder="Q4 Lead Outreach"
              error={errors.name?.message}
              {...register('name')}
            />
            <TextArea
              label="Description (optional)"
              placeholder="Brief description of this campaign's goals..."
              rows={3}
              {...register('description')}
            />
            {assistantOptions.length === 0 ? (
              <div className="rounded-md bg-warning-50 border border-warning-100 p-3">
                <p className="text-sm text-warning-600">
                  No assistants found.{' '}
                  <Link
                    href="/assistants/new"
                    className="underline font-medium"
                  >
                    Create an assistant first
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <Select
                label="AI Assistant"
                options={assistantOptions}
                placeholder="Select an assistant"
                error={errors.assistantId?.message}
                {...register('assistantId')}
              />
            )}
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            loading={isPending}
            disabled={assistantOptions.length === 0}
          >
            Create Campaign
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/campaigns')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}