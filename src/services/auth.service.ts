import { api } from '@/lib/api';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types';

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login', payload),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', payload),
};
