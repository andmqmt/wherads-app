'use client';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { useI18n } from '@/contexts/i18n-context';
import { campaignService } from '@/services/campaign.service';
import type { Campaign } from '@/types';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function CampaignsPage() {
  const { t } = useI18n();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [now] = useState(() => Date.now());

  const fetchCampaigns = useCallback(() => {
    campaignService
      .list()
      .then(setCampaigns)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchCampaigns();
    const onFocus = () => fetchCampaigns();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchCampaigns]);

  async function handleDelete(id: string) {
    if (!confirm(t.campaigns.confirmDelete)) return;

    try {
      await campaignService.delete(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir');
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t.campaigns.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t.campaigns.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/campaigns/design">
            <Button variant="secondary">
              <span className="flex items-center gap-1.5">
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
                {t.design.title}
              </span>
            </Button>
          </Link>
          <Link href="/campaigns/new">
            <Button>{t.campaigns.newCampaign}</Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="glass rounded-2xl border border-dashed border-zinc-300/50 p-12 text-center dark:border-zinc-700/50">
          <p className="text-zinc-500 dark:text-zinc-400">
            {t.campaigns.noCampaigns}
          </p>
          <Link href="/campaigns/new" className="mt-4 inline-block">
            <Button>{t.campaigns.createFirst}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => {
            const hasDateRange = campaign.startDate && campaign.endDate;
            const progress = hasDateRange
              ? Math.min(
                  100,
                  Math.max(
                    0,
                    ((now - new Date(campaign.startDate!).getTime()) /
                      (new Date(campaign.endDate!).getTime() -
                        new Date(campaign.startDate!).getTime())) *
                      100,
                  ),
                )
              : null;

            return (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="glass group flex flex-col rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-black/5"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                    {campaign.name}
                  </h3>
                  <StatusBadge status={campaign.status} />
                </div>

                {campaign.description && (
                  <p className="mb-3 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {campaign.description}
                  </p>
                )}

                <div className="mt-auto flex flex-col gap-3 border-t border-zinc-200/50 pt-3 dark:border-white/5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      {t.campaigns.budget}
                    </span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(campaign.budget)}
                    </span>
                  </div>

                  {hasDateRange && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>
                          {new Date(campaign.startDate!).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: 'short',
                            },
                          )}
                        </span>
                        <span>
                          {new Date(campaign.endDate!).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: 'short',
                            },
                          )}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <span className="flex-1 rounded-xl border border-zinc-200/60 bg-white/30 py-2 text-center text-sm font-medium text-zinc-600 transition-all group-hover:border-blue-500/30 group-hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:group-hover:text-blue-400">
                    {t.common.edit}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(campaign.id);
                    }}
                    className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/20 dark:text-red-400"
                  >
                    {t.common.delete}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
