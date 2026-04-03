import { api } from '@/lib/api';
import type {
  Campaign,
  CreateCampaignPayload,
  UpdateCampaignPayload,
} from '@/types';

export const campaignService = {
  list: () => api.get<Campaign[]>('/campaigns'),

  getById: (id: string) => api.get<Campaign>(`/campaigns/${id}`),

  create: (payload: CreateCampaignPayload) =>
    api.post<Campaign>('/campaigns', payload),

  update: (id: string, payload: UpdateCampaignPayload) =>
    api.patch<Campaign>(`/campaigns/${id}`, payload),

  delete: (id: string) => api.delete<void>(`/campaigns/${id}`),
};
