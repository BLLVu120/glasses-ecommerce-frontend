import { api } from '@/lib/axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Policy {
  id: number;
  managerUserId: string;
  managerUsername: string;
  code: string;
  title: string;
  description: string;
  effectiveFrom: string;
  effectiveTo: string;
  createdAt: string;
}

export interface PolicyForm {
  code: string;
  title: string;
  description: string;
  effectiveFrom: string;
  effectiveTo: string;
}

export interface PolicyListResult {
  items: Policy[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const policyApi = {
  // GET /api/policies — lấy danh sách có phân trang
  getAll: async (page = 0, size = 10): Promise<PolicyListResult> => {
    const res = await api.get(`/api/policies`, { params: { page, size } });
    return res.data.result;
  },

  // GET /api/policies/{id} — lấy 1 chính sách theo id
  getById: async (id: number): Promise<Policy> => {
    const res = await api.get(`/api/policies/${id}`);
    return res.data.result;
  },

  // POST /api/policies — tạo mới
  create: async (data: PolicyForm): Promise<Policy> => {
    const res = await api.post(`/api/policies`, data);
    return res.data.result;
  },

  // PUT /api/policies/{id} — cập nhật
  update: async (id: number, data: PolicyForm): Promise<Policy> => {
    const res = await api.put(`/api/policies/${id}`, data);
    return res.data.result;
  },

  // DELETE /api/policies/{id} — xóa
  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/policies/${id}`);
  },
};
