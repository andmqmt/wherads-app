'use client';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAuth } from '@/contexts/auth-context';
import { useI18n } from '@/contexts/i18n-context';
import { markdownToHtml } from '@/lib/markdown';
import { aiService } from '@/services/ai.service';
import { campaignService } from '@/services/campaign.service';
import type { Campaign, CampaignStatus } from '@/types';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const STATUS_COLORS: Record<CampaignStatus, string> = {
  ACTIVE: '#34d399',
  PAUSED: '#fbbf24',
  DRAFT: '#a1a1aa',
  COMPLETED: '#60a5fa',
};

const STATUS_LABELS_MAP: Record<
  CampaignStatus,
  'statusActive' | 'statusPaused' | 'statusDraft' | 'statusCompleted'
> = {
  ACTIVE: 'statusActive',
  PAUSED: 'statusPaused',
  DRAFT: 'statusDraft',
  COMPLETED: 'statusCompleted',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState('');

  const fetchData = useCallback(() => {
    Promise.all([
      campaignService.list(),
      aiService.getStatus().catch(() => ({ available: false })),
    ])
      .then(([data, status]) => {
        setCampaigns(data);
        setAiAvailable(status.available);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
    const onFocus = () => fetchData();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchData]);

  const totalBudget = campaigns.reduce((s, c) => s + c.budget, 0);
  const statusCounts = campaigns.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const activeCampaigns = statusCounts['ACTIVE'] || 0;
  const draftCampaigns = statusCounts['DRAFT'] || 0;
  const recentCampaigns = [...campaigns]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5);

  async function handleAskAi() {
    if (campaigns.length === 0) return;
    setIsAnalyzing(true);
    setAiError('');
    try {
      const result = await aiService.generateSummary({
        campaigns: campaigns.map((c) => ({
          name: c.name,
          status: c.status,
          budget: c.budget,
          description: c.description ?? undefined,
        })),
      });
      setAiSummary(result.summary);
      setAiTips(result.tips);
    } catch {
      setAiError(t.ai.unavailable);
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
      </div>
    );
  }

  // Budget by status for donut chart
  const budgetByStatus = (
    ['ACTIVE', 'PAUSED', 'DRAFT', 'COMPLETED'] as CampaignStatus[]
  ).map((s) => ({
    status: s,
    budget: campaigns
      .filter((c) => c.status === s)
      .reduce((sum, c) => sum + c.budget, 0),
    count: statusCounts[s] || 0,
  }));

  // Top 5 campaigns by budget for bar chart
  const topByBudget = [...campaigns]
    .sort((a, b) => b.budget - a.budget)
    .slice(0, 5);
  const maxBudget = Math.max(...topByBudget.map((c) => c.budget), 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t.dashboard.welcome}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {t.home.subtitle}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t.dashboard.totalCampaigns}
          value={campaigns.length.toString()}
          color="blue"
        />
        <StatCard
          label={t.dashboard.activeCampaigns}
          value={activeCampaigns.toString()}
          color="emerald"
        />
        <StatCard
          label={t.dashboard.totalBudget}
          value={new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
          }).format(totalBudget)}
          color="violet"
        />
        <StatCard
          label={t.dashboard.draftCampaigns}
          value={draftCampaigns.toString()}
          color="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Donut Chart — Status Distribution */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {t.dashboard.budgetDistribution}
          </h2>
          <div className="flex items-center gap-6">
            <DonutChart
              segments={budgetByStatus}
              total={totalBudget}
              formatter={(v) =>
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                }).format(v)
              }
            />
            <div className="flex flex-col gap-2.5">
              {budgetByStatus.map((s) => (
                <div key={s.status} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[s.status] }}
                  />
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {t.campaigns[STATUS_LABELS_MAP[s.status]]}
                  </span>
                  <span className="ml-auto font-medium tabular-nums text-zinc-900 dark:text-zinc-100">
                    {s.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart — Top Campaigns by Budget */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Top {t.campaigns.budget}
          </h2>
          {topByBudget.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-400">
              {t.campaigns.noCampaigns}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {topByBudget.map((c) => (
                <div key={c.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate font-medium text-zinc-700 dark:text-zinc-300">
                      {c.name}
                    </span>
                    <span className="shrink-0 tabular-nums text-zinc-500 dark:text-zinc-400">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(c.budget)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(c.budget / maxBudget) * 100}%`,
                        backgroundColor: STATUS_COLORS[c.status],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI + Recent Row */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* AI Panel */}
        <div className="lg:col-span-2">
          <div className="glass flex h-full flex-col rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg shadow-blue-500/20">
                <svg
                  className="h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {t.dashboard.aiSummary}
              </h2>
            </div>

            {campaigns.length === 0 ? (
              <p className="flex-1 text-sm text-zinc-400">
                {t.dashboard.noCampaignsYet}
              </p>
            ) : aiSummary ? (
              <div className="flex flex-1 flex-col gap-3">
                <div
                  className="prose prose-sm max-w-none text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 [&_strong]:text-zinc-900 dark:[&_strong]:text-zinc-100 [&_h2]:text-xs [&_h2]:font-semibold [&_h3]:text-xs [&_h3]:font-medium [&_h4]:text-xs [&_h4]:font-medium [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_li]:my-0.5 [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_code]:text-xs dark:[&_code]:bg-zinc-800 [&_hr]:my-3 [&_hr]:border-zinc-200 dark:[&_hr]:border-zinc-700 [&_p]:my-1.5"
                  dangerouslySetInnerHTML={{
                    __html: markdownToHtml(aiSummary),
                  }}
                />
                {aiTips.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      {t.dashboard.aiTips}
                    </span>
                    {aiTips.map((tip, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300"
                      >
                        <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-[9px] font-bold text-white">
                          {i + 1}
                        </span>
                        {tip}
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-auto pt-2 text-[9px] text-zinc-300 dark:text-zinc-600">
                  {t.ai.poweredBy}
                </p>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-6">
                {aiError && (
                  <p className="text-center text-xs text-red-500">{aiError}</p>
                )}
                <button
                  onClick={handleAskAi}
                  disabled={isAnalyzing || !aiAvailable}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-50"
                >
                  <svg
                    className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {isAnalyzing ? (
                      <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.48-8.48l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M7.76 7.76L4.93 4.93" />
                    ) : (
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    )}
                  </svg>
                  {isAnalyzing ? t.dashboard.analyzing : t.dashboard.askAi}
                </button>
                {!aiAvailable && (
                  <p className="text-center text-[10px] text-zinc-400">
                    {t.ai.unavailable}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="lg:col-span-3">
          <div className="glass overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {t.dashboard.recentCampaigns}
              </h2>
              <Link
                href="/campaigns"
                className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
              >
                {t.dashboard.viewAll} →
              </Link>
            </div>

            {recentCampaigns.length === 0 ? (
              <div className="px-6 pb-6 pt-2 text-center">
                <p className="text-sm text-zinc-400">
                  {t.campaigns.noCampaigns}
                </p>
                <Link href="/campaigns/new" className="mt-3 inline-block">
                  <Button>{t.campaigns.createFirst}</Button>
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200/40 dark:border-white/5">
                    <th className="px-6 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      {t.campaigns.name}
                    </th>
                    <th className="hidden px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-400 sm:table-cell">
                      {t.campaigns.status}
                    </th>
                    <th className="hidden px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-widest text-zinc-400 md:table-cell">
                      {t.campaigns.budget}
                    </th>
                    <th className="px-6 py-2 text-right text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      {t.campaigns.startDate}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentCampaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="border-b border-zinc-200/20 transition-colors last:border-0 hover:bg-white/30 dark:border-white/[.03] dark:hover:bg-white/[.03]"
                    >
                      <td className="px-6 py-3">
                        <Link
                          href={`/campaigns/${campaign.id}`}
                          className="text-sm font-medium text-zinc-900 transition-colors hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-400"
                        >
                          {campaign.name}
                        </Link>
                      </td>
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <StatusBadge status={campaign.status} />
                      </td>
                      <td className="hidden px-4 py-3 text-right text-sm tabular-nums text-zinc-600 dark:text-zinc-300 md:table-cell">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(campaign.budget)}
                      </td>
                      <td className="px-6 py-3 text-right text-sm tabular-nums text-zinc-400">
                        {campaign.startDate
                          ? new Date(campaign.startDate).toLocaleDateString(
                              'pt-BR',
                            )
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: 'blue' | 'emerald' | 'violet' | 'amber';
}) {
  const ring: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-500/5',
    emerald: 'from-emerald-500/20 to-emerald-500/5',
    violet: 'from-violet-500/20 to-violet-500/5',
    amber: 'from-amber-500/20 to-amber-500/5',
  };
  const text: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    violet: 'text-violet-600 dark:text-violet-400',
    amber: 'text-amber-600 dark:text-amber-400',
  };

  return (
    <div className="glass group rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
          {label}
        </span>
        <span
          className={`h-2 w-2 rounded-full bg-gradient-to-br ${ring[color]}`}
        />
      </div>
      <p className={`mt-2 text-2xl font-bold tracking-tight ${text[color]}`}>
        {value}
      </p>
    </div>
  );
}

/* SVG Donut Chart */
function DonutChart({
  segments,
  total,
  formatter,
}: {
  segments: { status: CampaignStatus; budget: number; count: number }[];
  total: number;
  formatter: (v: number) => string;
}) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 52;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;

  const filtered = segments.filter((s) => s.budget > 0);
  const arcs = filtered.reduce<
    {
      status: CampaignStatus;
      budget: number;
      count: number;
      dash: number;
      gap: number;
      offset: number;
    }[]
  >((acc, s) => {
    const pct = total > 0 ? s.budget / total : 0;
    const dash = circumference * pct;
    const gap = circumference - dash;
    const prevOffset =
      acc.length > 0
        ? acc[acc.length - 1].offset + acc[acc.length - 1].dash
        : 0;
    acc.push({ ...s, dash, gap, offset: prevOffset });
    return acc;
  }, []);

  return (
    <div className="relative shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-zinc-100 dark:text-white/5"
          strokeWidth={stroke}
        />
        {/* Segments */}
        {arcs.map((arc) => (
          <circle
            key={arc.status}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={STATUS_COLORS[arc.status]}
            strokeWidth={stroke}
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={-arc.offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            className="transition-all duration-700"
          />
        ))}
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
          {formatter(total)}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-zinc-400">
          Total
        </span>
      </div>
    </div>
  );
}
