'use client';

import { useI18n } from '@/contexts/i18n-context';
import type { CampaignStatus } from '@/types';

const statusClassName: Record<CampaignStatus, string> = {
  DRAFT: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  ACTIVE:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  PAUSED:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  COMPLETED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
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
