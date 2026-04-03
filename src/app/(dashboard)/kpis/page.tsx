'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18n-context';
import type { KpiAnalytics } from '@/services/ai.service';
import { aiService } from '@/services/ai.service';
import { campaignService } from '@/services/campaign.service';
import type { Campaign } from '@/types';
import { useCallback, useEffect, useState } from 'react';

const TREND_ICONS = {
  up: '↑',
  down: '↓',
  stable: '→',
};

const TREND_COLORS = {
  up: 'text-green-600 dark:text-green-400',
  down: 'text-red-500 dark:text-red-400',
  stable: 'text-zinc-500 dark:text-zinc-400',
};

const CONFIDENCE_COLORS: Record<string, string> = {
  Alta: 'bg-green-500/10 text-green-600 dark:text-green-400',
  High: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Média: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  Medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  Baixa: 'bg-red-500/10 text-red-500 dark:text-red-400',
  Low: 'bg-red-500/10 text-red-500 dark:text-red-400',
};

function LineChart({
  series,
  labels,
}: {
  series: { name: string; data: number[] }[];
  labels: string[];
}) {
  const allValues = series.flatMap((s) => s.data);
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
  const range = max - min || 1;
  const w = 320;
  const h = 140;
  const px = 8;
  const py = 12;
  const chartW = w - px * 2;
  const chartH = h - py * 2;

  const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <line
          key={p}
          x1={px}
          y1={py + chartH * (1 - p)}
          x2={w - px}
          y2={py + chartH * (1 - p)}
          stroke="currentColor"
          className="text-zinc-200 dark:text-zinc-700"
          strokeWidth="0.5"
          strokeDasharray={p === 0 ? undefined : '2,4'}
        />
      ))}

      {/* Labels */}
      {labels.map((label, i) => {
        const x = px + (i / Math.max(labels.length - 1, 1)) * chartW;
        return (
          <text
            key={i}
            x={x}
            y={h - 1}
            textAnchor="middle"
            className="fill-zinc-400 text-[7px]"
          >
            {label}
          </text>
        );
      })}

      {/* Lines */}
      {series.map((s, si) => {
        const points = s.data.map((v, i) => {
          const x = px + (i / Math.max(s.data.length - 1, 1)) * chartW;
          const y = py + chartH - ((v - min) / range) * chartH;
          return `${x},${y}`;
        });

        const gradientId = `grad-${si}`;
        const areaPoints = s.data.map((v, i) => {
          const x = px + (i / Math.max(s.data.length - 1, 1)) * chartW;
          const y = py + chartH - ((v - min) / range) * chartH;
          return { x, y };
        });

        return (
          <g key={si}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={colors[si % colors.length]}
                  stopOpacity="0.2"
                />
                <stop
                  offset="100%"
                  stopColor={colors[si % colors.length]}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d={`M${areaPoints.map((p) => `${p.x},${p.y}`).join(' L')} L${areaPoints[areaPoints.length - 1].x},${py + chartH} L${areaPoints[0].x},${py + chartH} Z`}
              fill={`url(#${gradientId})`}
            />
            <polyline
              points={points.join(' ')}
              fill="none"
              stroke={colors[si % colors.length]}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {s.data.map((v, i) => {
              const x = px + (i / Math.max(s.data.length - 1, 1)) * chartW;
              const y = py + chartH - ((v - min) / range) * chartH;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill="white"
                  stroke={colors[si % colors.length]}
                  strokeWidth="1.5"
                  className="dark:fill-zinc-900"
                />
              );
            })}
          </g>
        );
      })}

      {/* Legend */}
      {series.length > 1 &&
        series.map((s, si) => (
          <g key={`legend-${si}`}>
            <rect
              x={px + si * 80}
              y={1}
              width="8"
              height="8"
              rx="2"
              fill={colors[si % colors.length]}
            />
            <text
              x={px + si * 80 + 12}
              y={8}
              className="fill-zinc-500 text-[7px]"
            >
              {s.name}
            </text>
          </g>
        ))}
    </svg>
  );
}

function HealthScoreRing({ score }: { score: number }) {
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';

  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28">
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="currentColor"
        className="text-zinc-100 dark:text-zinc-800"
        strokeWidth="8"
      />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
        className="transition-all duration-1000"
      />
      <text
        x="50"
        y="46"
        textAnchor="middle"
        className="fill-zinc-900 text-xl font-bold dark:fill-white"
      >
        {score}
      </text>
      <text
        x="50"
        y="60"
        textAnchor="middle"
        className="fill-zinc-400 text-[8px]"
      >
        /100
      </text>
    </svg>
  );
}

export default function KpisPage() {
  const { t } = useI18n();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [kpis, setKpis] = useState<KpiAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const fetchCampaigns = useCallback(() => {
    campaignService
      .list()
      .then(setCampaigns)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  async function handleAnalyze() {
    if (campaigns.length === 0) return;
    setIsAnalyzing(true);
    setError('');

    try {
      const result = await aiService.generateKpis({
        campaigns: campaigns.map((c) => ({
          name: c.name,
          status: c.status,
          budget: c.budget,
          description: c.description ?? undefined,
          startDate: c.startDate ?? undefined,
          endDate: c.endDate ?? undefined,
        })),
      });
      setKpis(result);
    } catch {
      setError(t.ai.unavailable);
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

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t.kpis.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t.kpis.subtitle}
          </p>
        </div>
        <Button onClick={handleAnalyze} isLoading={isAnalyzing}>
          <span className="flex items-center gap-2">
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
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              />
            </svg>
            {isAnalyzing ? t.ai.generating : t.kpis.analyze}
          </span>
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="glass rounded-2xl border border-dashed border-zinc-300/50 p-12 text-center dark:border-zinc-700/50">
          <p className="text-zinc-500 dark:text-zinc-400">
            {t.kpis.noCampaigns}
          </p>
        </div>
      ) : !kpis ? (
        <div className="glass flex flex-col items-center gap-4 rounded-2xl p-12 text-center">
          <svg
            className="h-12 w-12 text-zinc-300 dark:text-zinc-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t.kpis.clickToAnalyze}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Overview + Health Score */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="glass flex flex-col items-center justify-center rounded-2xl p-6 lg:col-span-1">
              <HealthScoreRing score={kpis.overview.healthScore} />
              <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {t.kpis.healthScore}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:col-span-4">
              {[
                {
                  label: t.kpis.totalBudget,
                  value: `R$ ${kpis.overview.totalBudget.toLocaleString()}`,
                  color: 'from-blue-500 to-blue-600',
                },
                {
                  label: t.kpis.activeCampaigns,
                  value: kpis.overview.activeCampaigns.toString(),
                  color: 'from-green-500 to-green-600',
                },
                {
                  label: t.kpis.avgBudget,
                  value: `R$ ${kpis.overview.avgBudget.toLocaleString()}`,
                  color: 'from-violet-500 to-violet-600',
                },
                {
                  label: t.kpis.totalCampaigns,
                  value: campaigns.length.toString(),
                  color: 'from-amber-500 to-amber-600',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass flex flex-col rounded-2xl p-5"
                >
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white">
                    {stat.value}
                  </p>
                  <div
                    className={`mt-2 h-1 w-12 rounded-full bg-gradient-to-r ${stat.color}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="glass rounded-2xl p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {t.kpis.metricsTitle}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {kpis.metrics.map((m, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200/50 bg-white/30 p-4 dark:border-white/5 dark:bg-white/5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-zinc-400">
                      {m.name}
                    </p>
                    <span
                      className={`text-xs font-semibold ${TREND_COLORS[m.trend]}`}
                    >
                      {TREND_ICONS[m.trend]} {m.trendValue}
                    </span>
                  </div>
                  <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">
                    {m.value}
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-400">
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Charts */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {kpis.trendData.map((chart, i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {chart.label}
                </h4>
                <LineChart series={chart.series} labels={chart.labels} />
              </div>
            ))}
          </div>

          {/* Projections */}
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
                  d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                />
              </svg>
              {t.kpis.projections}
            </h3>
            <div className="flex flex-col gap-3">
              {kpis.projections.map((p, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 rounded-xl border border-zinc-200/50 bg-white/30 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5 dark:bg-white/5"
                >
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {p.metric}
                    </p>
                    <p className="text-xs text-zinc-400">{p.timeframe}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-400">
                        {t.kpis.current}
                      </p>
                      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                        {p.current}
                      </p>
                    </div>
                    <svg
                      className="h-4 w-4 text-zinc-300 dark:text-zinc-600"
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
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-400">
                        {t.kpis.projected}
                      </p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {p.projected}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${CONFIDENCE_COLORS[p.confidence] ?? 'bg-zinc-500/10 text-zinc-500'}`}
                    >
                      {p.confidence}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
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
                  d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
              {t.kpis.recommendations}
            </h3>
            <div className="flex flex-col gap-2">
              {kpis.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-zinc-200/50 bg-white/30 p-4 dark:border-white/5 dark:bg-white/5"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    {rec}
                  </p>
                </div>
              ))}
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
