// src/components/assistants/AssistantForm.tsx

'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Assistant, CreateAssistantInput } from '@/types';

const VOICE_OPTIONS = [
  { value: '', label: 'No voice (text only)' },
  { value: 'rachel', label: 'Rachel (11labs)' },
  { value: 'adam', label: 'Adam (11labs)' },
  { value: 'bella', label: 'Bella (11labs)' },
  { value: 'josh', label: 'Josh (11labs)' },
  { value: 'arnold', label: 'Arnold (11labs)' },
];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  firstMessage: z
    .string()
    .min(10, 'First message must be at least 10 characters'),
  systemPrompt: z
    .string()
    .min(20, 'System prompt must be at least 20 characters'),
  voiceId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface AssistantFormProps {
  defaultValues?: Assistant;
  onSubmit: (data: CreateAssistantInput) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function AssistantForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Create Assistant',
}: AssistantFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      firstMessage: defaultValues?.firstMessage ?? '',
      systemPrompt: defaultValues?.systemPrompt ?? '',
      voiceId: String(defaultValues?.config?.voice?.voiceId ?? ''),
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    const payload: CreateAssistantInput = {
      name: data.name,
      firstMessage: data.firstMessage,
      systemPrompt: data.systemPrompt,
    };
    if (data.voiceId) {
      payload.voice = { provider: '11labs', voiceId: data.voiceId };
    }
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-5 max-w-2xl"
    >
      <Card>
        <h2 className="text-sm font-semibold text-text-primary mb-4">
          Basic Information
        </h2>
        <div className="flex flex-col gap-4">
          <Input
            label="Assistant name"
            placeholder="e.g. Lead Qualifier Pro"
            error={errors.name?.message}
            {...register('name')}
          />
          <Select
            label="Voice"
            options={VOICE_OPTIONS}
            placeholder="Select a voice"
            {...register('voiceId')}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-text-primary mb-4">
          Conversation Setup
        </h2>
        <div className="flex flex-col gap-4">
          <TextArea
            label="First message"
            placeholder="Hi, I'm calling on behalf of Acme Corp. Is this a good time to chat about your property needs?"
            rows={3}
            error={errors.firstMessage?.message}
            hint="The opening line your AI will say when the call connects"
            {...register('firstMessage')}
          />
          <TextArea
            label="System prompt"
            placeholder="You are a professional lead qualification agent for Acme Corp. Your goal is to qualify leads by asking about their needs, budget, and timeline..."
            rows={8}
            error={errors.systemPrompt?.message}
            hint="Instructions that guide the AI's behavior throughout the call"
            {...register('systemPrompt')}
          />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" loading={isLoading}>
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}