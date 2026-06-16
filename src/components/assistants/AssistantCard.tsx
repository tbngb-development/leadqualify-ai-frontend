// src/components/assistants/AssistantCard.tsx

'use client';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useDeleteAssistant } from '@/hooks/useAssistants';
import { formatDate } from '@/lib/utils/formatDate';
import type { Assistant } from '@/types';
import { Bot, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface AssistantCardProps {
  assistant: Assistant;
  canEdit?: boolean;
}

export function AssistantCard({ assistant, canEdit = true }: AssistantCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutate: deleteAssistant, isPending } = useDeleteAssistant();

  return (
    <>
      <Card className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
              <Bot size={18} className="text-brand-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                {assistant.name}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Created {formatDate(assistant.createdAt)}
              </p>
            </div>
          </div>
          <Badge variant="success" dot>
            Active
          </Badge>
        </div>

        {assistant.config?.voice && (
          <div className="text-xs text-text-muted border-t border-surface-border pt-3">
            Voice:{' '}
            <span className="font-medium text-text-secondary">
              {String(assistant.config.voice?.voiceId ?? '—')}
            </span>
          </div>
        )}

        {canEdit && (
          <div className="flex items-center gap-2 border-t border-surface-border pt-3">
            <Link href={`/assistants/${assistant.id}`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Pencil size={13} />}
                className="w-full"
              >
                Edit
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 size={13} />}
              onClick={() => setConfirmDelete(true)}
              className="text-error-600 hover:bg-error-50"
            >
              Delete
            </Button>
          </div>
        )}
      </Card>

      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteAssistant(assistant.id);
          setConfirmDelete(false);
        }}
        title="Delete Assistant"
        description={`Are you sure you want to delete "${assistant.name}"? This action cannot be undone.`}
        loading={isPending}
      />
    </>
  );
}