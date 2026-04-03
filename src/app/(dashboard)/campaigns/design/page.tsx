'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/contexts/i18n-context';
import {
  exportToGoogleAds,
  exportToLinkedInAds,
  exportToMetaAds,
  exportToTikTokAds,
} from '@/lib/export-campaign';
import { aiService } from '@/services/ai.service';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';

type CampaignDesign = {
  campaignName: string;
  regions: { name: string; reason: string }[];
  audience: { segment: string; ageRange: string; interests: string[] }[];
  priceRanges: {
    channel: string;
    minBudget: number;
    maxBudget: number;
    description: string;
  }[];
  channels: { name: string; priority: string; reason: string }[];
  timeline: { phase: string; duration: string; actions: string[] }[];
  kpis: { metric: string; target: string }[];
};

const PRIORITY_COLORS: Record<string, string> = {
  Alta: 'bg-green-500/10 text-green-600 dark:text-green-400',
  High: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Média: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  Medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  Baixa: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
  Low: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
};

export default function DesignCampaignPage() {
  const { t } = useI18n();
  const [businessDescription, setBusinessDescription] = useState('');
  const [products, setProducts] = useState('');
  const [targetRegion, setTargetRegion] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [budget, setBudget] = useState('');
  const [objective, setObjective] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [design, setDesign] = useState<CampaignDesign | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setDesign(null);

    try {
      const result = await aiService.designCampaign({
        businessDescription,
        products: products || undefined,
        targetRegion: targetRegion || undefined,
        targetAudience: targetAudience || undefined,
        budget: budget ? Number(budget) : undefined,
        objective: objective || undefined,
      });
      setDesign(result);
    } catch {
      setError(t.ai.unavailable);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t.design.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {t.design.subtitle}
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
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="businessDescription"
            className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            {t.design.businessDescription} *
          </label>
          <textarea
            id="businessDescription"
            rows={3}
            required
            className="rounded-xl border border-zinc-200/60 bg-white/50 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100"
            placeholder={t.design.businessPlaceholder}
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
          />
        </div>

        <Input
          id="products"
          label={t.design.products}
          placeholder={t.design.productsPlaceholder}
          value={products}
          onChange={(e) => setProducts(e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="targetRegion"
            label={t.design.targetRegion}
            placeholder={t.design.regionPlaceholder}
            value={targetRegion}
            onChange={(e) => setTargetRegion(e.target.value)}
          />
          <Input
            id="targetAudience"
            label={t.design.targetAudience}
            placeholder={t.design.audiencePlaceholder}
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="budget"
            label={t.design.budget}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <Input
            id="objective"
            label={t.design.objective}
            placeholder={t.design.objectivePlaceholder}
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          />
        </div>

        <div className="mt-2 flex gap-3">
          <Button type="submit" isLoading={isLoading}>
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </svg>
              {isLoading ? t.ai.generating : t.design.generate}
            </span>
          </Button>
          <Link href="/campaigns">
            <Button type="button" variant="secondary">
              {t.common.cancel}
            </Button>
          </Link>
        </div>
      </form>

      {design && (
        <div className="mt-8 flex flex-col gap-6">
          {/* Campaign Name */}
          <div className="glass rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-violet-500">
                <svg
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  {t.design.suggestedName}
                </p>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {design.campaignName}
                </h2>
              </div>
            </div>
            <Link
              href={`/campaigns/new?name=${encodeURIComponent(design.campaignName)}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-violet-500/10 px-4 py-2 text-sm font-medium text-blue-600 transition-all hover:from-blue-500/20 hover:to-violet-500/20 dark:text-blue-400"
            >
              {t.design.createFromDesign}
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>

          {/* Regions */}
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              {t.design.regions}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {design.regions.map((r, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200/50 bg-white/30 p-4 dark:border-white/5 dark:bg-white/5"
                >
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {r.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {r.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
              {t.design.audience}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {design.audience.map((a, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200/50 bg-white/30 p-4 dark:border-white/5 dark:bg-white/5"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {a.segment}
                    </p>
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                      {a.ageRange}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {a.interests.map((int, j) => (
                      <span
                        key={j}
                        className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channels + Price Ranges */}
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t.design.channelsAndBudget}
            </h3>
            <div className="flex flex-col gap-3">
              {design.priceRanges.map((pr, i) => {
                const channel = design.channels.find(
                  (c) =>
                    c.name.toLowerCase().includes(pr.channel.toLowerCase()) ||
                    pr.channel.toLowerCase().includes(c.name.toLowerCase()),
                );
                const priority = channel?.priority ?? '';
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-zinc-200/50 bg-white/30 p-4 dark:border-white/5 dark:bg-white/5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {pr.channel}
                      </p>
                      <div className="flex items-center gap-2">
                        {priority && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${PRIORITY_COLORS[priority] ?? 'bg-zinc-500/10 text-zinc-500'}`}
                          >
                            {priority}
                          </span>
                        )}
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          R$ {pr.minBudget.toLocaleString()} –{' '}
                          {pr.maxBudget.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {pr.description}
                    </p>
                    {channel?.reason && (
                      <p className="mt-1 text-xs italic text-zinc-400 dark:text-zinc-500">
                        {channel.reason}
                      </p>
                    )}
                  </div>
                );
              })}
              {/* Show channels not covered by priceRanges */}
              {design.channels
                .filter(
                  (c) =>
                    !design.priceRanges.some(
                      (pr) =>
                        c.name
                          .toLowerCase()
                          .includes(pr.channel.toLowerCase()) ||
                        pr.channel.toLowerCase().includes(c.name.toLowerCase()),
                    ),
                )
                .map((c, i) => (
                  <div
                    key={`ch-${i}`}
                    className="rounded-xl border border-zinc-200/50 bg-white/30 p-4 dark:border-white/5 dark:bg-white/5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {c.name}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${PRIORITY_COLORS[c.priority] ?? 'bg-zinc-500/10 text-zinc-500'}`}
                      >
                        {c.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {c.reason}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {t.design.timeline}
            </h3>
            <div className="relative flex flex-col gap-4 pl-6">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500 to-violet-500" />
              {design.timeline.map((phase, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-6 top-1 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-violet-500">
                    <span className="text-[9px] font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <div className="rounded-xl border border-zinc-200/50 bg-white/30 p-4 dark:border-white/5 dark:bg-white/5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {phase.phase}
                      </p>
                      <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-600 dark:text-violet-400">
                        {phase.duration}
                      </span>
                    </div>
                    <ul className="mt-2 flex flex-col gap-1">
                      {phase.actions.map((action, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-300"
                        >
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
              {t.design.kpis}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {design.kpis.map((kpi, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200/50 bg-white/30 p-4 text-center dark:border-white/5 dark:bg-white/5"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                    {kpi.metric}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {kpi.target}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Export to Platforms */}
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              {t.design.exportTitle}
            </h3>
            <p className="mb-4 text-xs text-zinc-400 dark:text-zinc-500">
              {t.design.exportSubtitle}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => exportToGoogleAds(design)}
                className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200/50 bg-white/30 p-4 transition-all hover:border-blue-500/30 hover:bg-blue-500/5 dark:border-white/5 dark:bg-white/5 dark:hover:border-blue-500/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4285F4]/10">
                  <span className="text-lg font-bold text-[#4285F4]">G</span>
                </div>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {t.design.exportGoogle}
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {t.design.exportCsv}
                </span>
              </button>
              <button
                type="button"
                onClick={() => exportToMetaAds(design)}
                className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200/50 bg-white/30 p-4 transition-all hover:border-blue-500/30 hover:bg-blue-500/5 dark:border-white/5 dark:bg-white/5 dark:hover:border-blue-500/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0081FB]/10">
                  <span className="text-lg font-bold text-[#0081FB]">M</span>
                </div>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {t.design.exportMeta}
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {t.design.exportJson}
                </span>
              </button>
              <button
                type="button"
                onClick={() => exportToTikTokAds(design)}
                className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200/50 bg-white/30 p-4 transition-all hover:border-blue-500/30 hover:bg-blue-500/5 dark:border-white/5 dark:bg-white/5 dark:hover:border-blue-500/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#000000]/10 dark:bg-white/10">
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">
                    T
                  </span>
                </div>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {t.design.exportTikTok}
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {t.design.exportJson}
                </span>
              </button>
              <button
                type="button"
                onClick={() => exportToLinkedInAds(design)}
                className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200/50 bg-white/30 p-4 transition-all hover:border-blue-500/30 hover:bg-blue-500/5 dark:border-white/5 dark:bg-white/5 dark:hover:border-blue-500/20"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A66C2]/10">
                  <span className="text-lg font-bold text-[#0A66C2]">in</span>
                </div>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {t.design.exportLinkedIn}
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {t.design.exportCsv}
                </span>
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] text-zinc-300 dark:text-zinc-600">
            {t.ai.poweredBy}
          </p>
        </div>
      )}
    </div>
  );
}
