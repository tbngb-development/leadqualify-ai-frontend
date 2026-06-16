// src/app/(dashboard)/assistants/[id]/page.tsx

'use client';

import { AssistantForm } from '@/components/assistants/AssistantForm';
import { PageSpinner } from '@/components/ui/Spinner';
import { useAssistant, useUpdateAssistant } from '@/hooks/useAssistants';
import type { CreateAssistantInput } from '@/types';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function EditAssistantPage() {
  const params = useParams();
  const id = String(params.id);
  const router = useRouter();

  const { data: assistant, isLoading } = useAssistant(id);
  const { mutate: update, isPending } = useUpdateAssistant(id);

  const handleSubmit = (data: CreateAssistantInput) => {
    update(data, { onSuccess: () => router.push('/assistants') });
  };

  if (isLoading) return <PageSpinner />;
  if (!assistant)
    return (
      <p className="text-text-muted text-sm">Assistant not found.</p>
    );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Link
          href="/assistants"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-3 transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Assistants
        </Link>
        <h2 className="text-lg font-semibold text-text-primary">
          Edit Assistant
        </h2>
        <p className="text-sm text-text-muted mt-0.5">
          Update your AI voice agent configuration
        </p>
      </div>
      <AssistantForm
        defaultValues={assistant}
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitLabel="Save Changes"
      />
    </div>
  );
}