'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useI18n } from '@/contexts/i18n-context';
import { aiService } from '@/services/ai.service';
import { campaignService } from '@/services/campaign.service';
import type { Campaign, CampaignStatus } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

function formatDateForInput(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
}

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { t } = useI18n();

  const statusOptions = [
    { value: 'DRAFT', label: t.campaigns.statusDraft },
    { value: 'ACTIVE', label: t.campaigns.statusActive },
    { value: 'PAUSED', label: t.campaigns.statusPaused },
    { value: 'COMPLETED', label: t.campaigns.statusCompleted },
  ];

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<CampaignStatus>('DRAFT');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [insights, setInsights] = useState('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  useEffect(() => {
    campaignService
      .getById(id)
      .then((data) => {
        setCampaign(data);
        setName(data.name);
        setDescription(data.description ?? '');
        setStatus(data.status);
        setBudget(data.budget.toString());
        setStartDate(formatDateForInput(data.startDate));
        setEndDate(formatDateForInput(data.endDate));
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsFetching(false));
  }, [id]);

  async function handleGenerateInsights() {
    setIsGeneratingInsights(true);
    try {
      const result = await aiService.generateInsights({
        campaignName: name,
        description: description || undefined,
        status,
        budget: Number(budget) || 0,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setInsights(result.insights);
    } catch {
      setError(t.ai.unavailable);
    } finally {
      setIsGeneratingInsights(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await campaignService.update(id, {
        name,
        description: description || undefined,
        status,
        budget: budget ? Number(budget) : undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      });
      router.push('/campaigns');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao atualizar campanha',
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
      </div>
    );
  }

  if (!campaign && error) {
    return (
      <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t.campaigns.editTitle}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {t.campaigns.editSubtitle}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="glass noise flex flex-col gap-4 rounded-2xl p-6"
      >
        <Input
          id="name"
          label={t.campaigns.name}
          placeholder="Ex: Campanha Black Friday"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            {t.campaigns.description}
          </label>
          <textarea
            id="description"
            rows={3}
            className="rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
            placeholder="Descreva o objetivo da campanha"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Select
          id="status"
          label={t.campaigns.status}
          value={status}
          onChange={(e) => setStatus(e.target.value as CampaignStatus)}
          options={statusOptions}
        />

        <Input
          id="budget"
          label={t.campaigns.budget}
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="startDate"
            label={t.campaigns.startDate}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            id="endDate"
            label={t.campaigns.endDate}
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="mt-4 flex gap-3">
          <Button type="submit" isLoading={isLoading}>
            {t.common.save}
          </Button>
          <button
            type="button"
            onClick={handleGenerateInsights}
            disabled={isGeneratingInsights}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-violet-500/10 px-5 py-2.5 text-sm font-medium text-blue-600 transition-all duration-200 hover:from-blue-500/20 hover:to-violet-500/20 disabled:opacity-50 dark:text-blue-400"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            {isGeneratingInsights ? t.ai.generating : t.ai.generateInsights}
          </button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            {t.common.cancel}
          </Button>
        </div>
      </form>

      {insights && (
        <div className="glass noise mt-6 rounded-2xl border border-blue-500/20 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              {t.ai.insightsTitle}
            </h2>
            <button
              type="button"
              onClick={() => setInsights('')}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              {t.ai.close}
            </button>
          </div>
          <div className="prose prose-sm max-w-none text-zinc-700 dark:text-zinc-300 [&_strong]:text-zinc-900 dark:[&_strong]:text-zinc-100">
            <div
              dangerouslySetInnerHTML={{
                __html: insights
                  .replace(/\n/g, '<br/>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
