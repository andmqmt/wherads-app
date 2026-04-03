'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/contexts/i18n-context';
import { aiService } from '@/services/ai.service';
import { campaignService } from '@/services/campaign.service';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export default function NewCampaignPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerateDescription() {
    if (!name.trim()) return;
    setIsGenerating(true);
    try {
      const result = await aiService.generateDescription({
        campaignName: name,
        keywords: keywords || undefined,
        budget: budget ? Number(budget) : undefined,
      });
      setDescription(result.description);
    } catch {
      setError(t.ai.unavailable);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await campaignService.create({
        name,
        description: description || undefined,
        budget: budget ? Number(budget) : undefined,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      });
      router.refresh();
      router.push('/campaigns');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar campanha');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t.campaigns.createTitle}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {t.campaigns.createSubtitle}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="glass flex flex-col gap-4 rounded-2xl p-6"
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
          <div className="flex items-center justify-between">
            <label
              htmlFor="description"
              className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
            >
              {t.campaigns.description}
            </label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={!name.trim() || isGenerating}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-violet-500/10 px-3 py-1 text-xs font-medium text-blue-600 transition-all duration-200 hover:from-blue-500/20 hover:to-violet-500/20 disabled:opacity-50 dark:text-blue-400"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              {isGenerating ? t.ai.generating : t.ai.generateDescription}
            </button>
          </div>
          <Input
            id="keywords"
            label={t.ai.keywords}
            placeholder={t.ai.keywordsPlaceholder}
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <textarea
            id="description"
            rows={3}
            className="rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
            placeholder="Descreva o objetivo da campanha"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

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
            {t.campaigns.newCampaign}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            {t.common.cancel}
          </Button>
        </div>
      </form>
    </div>
  );
}
