import { api } from '@/lib/api';

type GenerateInsightsRequest = {
  campaignName: string;
  description?: string;
  status: string;
  budget: number;
  startDate?: string;
  endDate?: string;
};

type GenerateDescriptionRequest = {
  campaignName: string;
  keywords?: string;
  budget?: number;
};

type CampaignSummaryItem = {
  name: string;
  status: string;
  budget: number;
  description?: string;
};

type GenerateSummaryRequest = {
  campaigns: CampaignSummaryItem[];
};

type DesignCampaignRequest = {
  businessDescription: string;
  products?: string;
  targetRegion?: string;
  targetAudience?: string;
  budget?: number;
  objective?: string;
};

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

type KpiCampaignItem = {
  name: string;
  status: string;
  budget: number;
  description?: string;
  startDate?: string;
  endDate?: string;
};

type GenerateKpisRequest = {
  campaigns: KpiCampaignItem[];
};

export type KpiAnalytics = {
  overview: {
    totalBudget: number;
    activeCampaigns: number;
    avgBudget: number;
    healthScore: number;
  };
  metrics: {
    name: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    trendValue: string;
    description: string;
  }[];
  trendData: {
    label: string;
    series: { name: string; data: number[] }[];
    labels: string[];
  }[];
  projections: {
    metric: string;
    current: string;
    projected: string;
    confidence: string;
    timeframe: string;
  }[];
  recommendations: string[];
};

export const aiService = {
  getStatus: () => api.get<{ available: boolean }>('/ai/status'),

  generateInsights: (data: GenerateInsightsRequest) =>
    api.post<{ insights: string }>('/ai/insights', data),

  generateDescription: (data: GenerateDescriptionRequest) =>
    api.post<{ description: string }>('/ai/generate-description', data),

  generateSummary: (data: GenerateSummaryRequest) =>
    api.post<{ summary: string; tips: string[] }>('/ai/summary', data),

  designCampaign: (data: DesignCampaignRequest) =>
    api.post<CampaignDesign>('/ai/design-campaign', data),

  generateKpis: (data: GenerateKpisRequest) =>
    api.post<KpiAnalytics>('/ai/kpis', data),
};
