import type { ApiResponse } from './types';

export interface LensProduct {
  id: string;
  name: string;
  material: string;
  price: number;
  description: string;
}

export interface CreateLensRequest {
  name: string;
  material: string;
  price: number;
  description: string;
}

export type LensListResponse = ApiResponse<LensProduct[]>;
