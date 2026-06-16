// src/app/(dashboard)/assistants/new/page.tsx

'use client';

import { AssistantForm } from '@/components/assistants/AssistantForm';
import { useCreateAssistant } from '@/hooks/useAssistants';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CreateAssistantInput } from '@/types';

export default function NewAssistantPage() {
  const router = useRouter();
  const { mutate: create, isPending } = useCreateAssistant();

  const handleSubmit = (data: CreateAssistantInput) => {
    create(data, {
      onSuccess: () => router.push('/assistants'),
    });
  };

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
          Create Assistant
        </h2>
        <p className="text-sm text-text-muted mt-0.5">
          Configure a new AI voice agent
        </p>
      </div>
      <AssistantForm
        onSubmit={handleSubmit}
        isLoading={isPending}
        submitLabel="Create Assistant"
      />
    </div>
  );
}