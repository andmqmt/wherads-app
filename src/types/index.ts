export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type Campaign = {
  id: string;
  name: string;
  description: string | null;
  status: CampaignStatus;
  budget: number;
  startDate: string | null;
  endDate: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type CreateCampaignPayload = {
  name: string;
  description?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
};

export type UpdateCampaignPayload = Partial<CreateCampaignPayload> & {
  status?: CampaignStatus;
};
