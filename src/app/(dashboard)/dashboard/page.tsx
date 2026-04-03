'use client';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { useAuth } from '@/contexts/auth-context';
import { useI18n } from '@/contexts/i18n-context';
import { aiService } from '@/services/ai.service';
import { campaignService } from '@/services/campaign.service';
import type { Campaign, CampaignStatus } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const STATUS_COLORS: Record<CampaignStatus, string> = {
  DRAFT: '#a1a1aa',
  ACTIVE: '#10b981',
  PAUSED: '#f59e0b',
  COMPLETED: '#3b82f6',
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

  useEffect(() => {
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

  const maxBudgetByStatus = Math.max(
    ...Object.values(statusCounts).map(Number),
    1,
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t.dashboard.welcome}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {t.home.subtitle}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t.dashboard.totalCampaigns}
          value={campaigns.length.toString()}
          icon={
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
              />
            </svg>
          }
        />
        <StatCard
          label={t.dashboard.activeCampaigns}
          value={activeCampaigns.toString()}
          accent="emerald"
          icon={
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
          }
        />
        <StatCard
          label={t.dashboard.totalBudget}
          value={new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
          }).format(totalBudget)}
          accent="violet"
          icon={
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          label={t.dashboard.draftCampaigns}
          value={draftCampaigns.toString()}
          accent="amber"
          icon={
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* AI Panel */}
        <div className="lg:col-span-2">
          <div className="glass noise flex h-full flex-col rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500">
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
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {t.dashboard.aiSummary}
              </h2>
            </div>

            {campaigns.length === 0 ? (
              <p className="flex-1 text-sm text-zinc-400">
                {t.dashboard.noCampaignsYet}
              </p>
            ) : aiSummary ? (
              <div className="flex flex-1 flex-col gap-4">
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {aiSummary}
                </p>
                {aiTips.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {t.dashboard.aiTips}
                    </span>
                    {aiTips.map((tip, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {i + 1}
                        </span>
                        {tip}
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-auto text-[10px] text-zinc-400">
                  {t.ai.poweredBy}
                </p>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-4">
                {aiError && (
                  <p className="text-center text-xs text-red-500">{aiError}</p>
                )}
                <button
                  onClick={handleAskAi}
                  disabled={isAnalyzing || !aiAvailable}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50"
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

        {/* Status Distribution */}
        <div className="lg:col-span-3">
          <div className="glass noise rounded-2xl p-6">
            <h2 className="mb-5 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {t.dashboard.budgetDistribution}
            </h2>
            <div className="flex flex-col gap-4">
              {(
                ['ACTIVE', 'PAUSED', 'DRAFT', 'COMPLETED'] as CampaignStatus[]
              ).map((status) => {
                const count = statusCounts[status] || 0;
                const budgetForStatus = campaigns
                  .filter((c) => c.status === status)
                  .reduce((s, c) => s + c.budget, 0);
                return (
                  <div key={status} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: STATUS_COLORS[status],
                          }}
                        />
                        <StatusBadge status={status} />
                        <span className="text-zinc-400">({count})</span>
                      </div>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          maximumFractionDigits: 0,
                        }).format(budgetForStatus)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(count / maxBudgetByStatus) * 100}%`,
                          backgroundColor: STATUS_COLORS[status],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent campaigns */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {t.dashboard.recentCampaigns}
          </h2>
          <Link
            href="/campaigns"
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
          >
            {t.dashboard.viewAll} →
          </Link>
        </div>

        {recentCampaigns.length === 0 ? (
          <div className="glass noise rounded-2xl p-8 text-center">
            <p className="text-sm text-zinc-400">{t.campaigns.noCampaigns}</p>
            <Link href="/campaigns/new" className="mt-3 inline-block">
              <Button>{t.campaigns.createFirst}</Button>
            </Link>
          </div>
        ) : (
          <div className="glass noise overflow-hidden rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200/50 dark:border-white/5">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {t.campaigns.name}
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 sm:table-cell">
                    {t.campaigns.status}
                  </th>
                  <th className="hidden px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 md:table-cell">
                    {t.campaigns.budget}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {t.campaigns.startDate}
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-zinc-200/30 transition-colors last:border-0 hover:bg-white/40 dark:border-white/5 dark:hover:bg-white/5"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="font-medium text-zinc-900 transition-colors hover:text-blue-600 dark:text-zinc-50 dark:hover:text-blue-400"
                      >
                        {campaign.name}
                      </Link>
                      {campaign.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-zinc-400">
                          {campaign.description}
                        </p>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="hidden px-4 py-3 text-right text-sm text-zinc-600 dark:text-zinc-300 md:table-cell">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(campaign.budget)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-zinc-500 dark:text-zinc-400">
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
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: 'emerald' | 'violet' | 'amber';
}) {
  const colorMap = {
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
    violet: 'text-violet-600 dark:text-violet-400 bg-violet-500/10',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
  };
  const colors = accent
    ? colorMap[accent]
    : 'text-blue-600 dark:text-blue-400 bg-blue-500/10';

  return (
    <div className="glass noise rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
        <span className={`rounded-lg p-2 ${colors}`}>{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
    </div>
  );
}
