import { api } from '@/lib/axios';
import type { CreateLensRequest, LensListResponse } from '../types/lens';

export const lensApi = {
  getAll: async () => await api.get<LensListResponse>('/lenses').then((res) => res.data),

  create: async (payload: CreateLensRequest) =>
    await api.post('/lenses', payload).then((res) => res.data),
};
import { api } from '@/lib/axios';
import type { CreateLensRequest, LensListResponse } from '../types/lens';

export const lensApi = {
  getAll: async () => await api.get<LensListResponse>('/lenses').then((res) => res.data),

  create: async (payload: CreateLensRequest) =>
    await api.post('/lenses', payload).then((res) => res.data),
};
import { api } from '@/lib/axios';
import type { CreateLensRequest, LensListResponse } from '../types/lens';

export const lensApi = {
  getAll: async () => await api.get<LensListResponse>('/lenses').then((res) => res.data),

  create: async (payload: CreateLensRequest) =>
    await api.post('/lenses', payload).then((res) => res.data),
};
