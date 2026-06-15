// src/app/(dashboard)/assistants/page.tsx

'use client';

import { AssistantCard } from '@/components/assistants/AssistantCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageSpinner } from '@/components/ui/Spinner';
import { useAssistants } from '@/hooks/useAssistants';
import { useAuthStore } from '@/store/authStore';
import { Bot, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AssistantsPage() {
  const { data: assistants, isLoading } = useAssistants();
  const { user } = useAuthStore();
  const canEdit = user?.role !== 'USER';

  if (isLoading) return <PageSpinner />;

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            AI Assistants
          </h2>
          <p className="text-sm text-text-muted mt-0.5">
            Manage your AI voice agents
          </p>
        </div>
        {canEdit && (
          <Link href="/assistants/new">
            <Button leftIcon={<Plus size={15} />}>New Assistant</Button>
          </Link>
        )}
      </div>

      {/* Grid */}
      {assistants && assistants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assistants.map((a) => (
            <AssistantCard key={a.id} assistant={a} canEdit={canEdit} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bot size={22} />}
          title="No assistants yet"
          description="Create your first AI assistant to start making calls."
          action={
            canEdit ? (
              <Link href="/assistants/new">
                <Button leftIcon={<Plus size={15} />}>
                  Create your first assistant
                </Button>
              </Link>
            ) : undefined
          }
        />
      )}
    </div>
  );
}