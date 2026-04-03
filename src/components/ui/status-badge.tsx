'use client';

import { useI18n } from '@/contexts/i18n-context';
import type { CampaignStatus } from '@/types';

const statusClassName: Record<CampaignStatus, string> = {
  DRAFT: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  PAUSED: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  COMPLETED: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
};

const statusKey: Record<
  CampaignStatus,
  'statusDraft' | 'statusActive' | 'statusPaused' | 'statusCompleted'
> = {
  DRAFT: 'statusDraft',
  ACTIVE: 'statusActive',
  PAUSED: 'statusPaused',
  COMPLETED: 'statusCompleted',
};

export function StatusBadge({ status }: { status: CampaignStatus }) {
  const { t } = useI18n();

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClassName[status]}`}
    >
      {t.campaigns[statusKey[status]]}
    </span>
  );
}
