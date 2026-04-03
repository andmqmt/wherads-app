'use client';

import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { useI18n } from '@/contexts/i18n-context';
import { campaignService } from '@/services/campaign.service';
import type { Campaign } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CampaignsPage() {
  const { t } = useI18n();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    campaignService
      .list()
      .then(setCampaigns)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

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
        <svg
          className="h-8 w-8 animate-spin text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {t.campaigns.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t.campaigns.subtitle}
          </p>
        </div>
        <Link href="/campaigns/new">
          <Button>{t.campaigns.newCampaign}</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <p className="text-zinc-500 dark:text-zinc-400">
            {t.campaigns.noCampaigns}
          </p>
          <Link href="/campaigns/new" className="mt-4 inline-block">
            <Button>{t.campaigns.createFirst}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {campaign.name}
                </h3>
                <StatusBadge status={campaign.status} />
              </div>

              {campaign.description && (
                <p className="mb-4 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {campaign.description}
                </p>
              )}

              <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {t.campaigns.budget}:
                </span>{' '}
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(campaign.budget)}
              </div>

              <div className="flex gap-2">
                <Link href={`/campaigns/${campaign.id}`} className="flex-1">
                  <Button variant="secondary" className="w-full">
                    {t.common.edit}
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(campaign.id)}
                >
                  {t.common.delete}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
