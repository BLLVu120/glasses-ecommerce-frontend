// src/features/products/api/variant-api.ts
import { api } from '@/lib/axios';
import type { VariantQueryParams, VariantResponse } from '../types/types';

export const variantApi = {
  // Cập nhật endpoint đúng: /products/{productId}/variants
  getAll: async (productId: string) => {
    const response = await api.get(`/products/${productId}/variants`, {
      params: {
        page: 0,
        size: 100, // Lấy số lượng lớn để hiển thị đủ ở trang quản lý
        sortBy: 'id',
        sortDir: 'asc',
      },
    });

    console.log('variantApi.getAll full response:', response.data);

    // Dựa trên Swagger thông thường, dữ liệu nằm trong result.content hoặc result.items
    // Bạn hãy kiểm tra log, nếu là phân trang thì thường là .content
    const items = response.data?.result?.content ?? response.data?.result?.items ?? [];
    return { result: items };
  },

  create: async (productId: string, payload: any) => {
    const body = {
      productId,
      colorName: payload.colorName,
      frameFinish: payload.frameFinish,
      lensWidthMm: Number(payload.lensWidthMm) || 0,
      bridgeWidthMm: Number(payload.bridgeWidthMm) || 0,
      templeLengthMm: Number(payload.templeLengthMm) || 0,
      sizeLabel: payload.sizeLabel,
      price: Number(payload.price) || 0,
      quantity: Number(payload.quantity) || 0,
      status: payload.status,
      orderItemType: payload.orderItemType,
    };
    const response = await api.post(`/product-variants`, body);
    return response.data;
  },

  update: async (productId: string, variantId: string, payload: any) => {
    const body = {
      productId,
      colorName: payload.colorName,
      frameFinish: payload.frameFinish,
      lensWidthMm: Number(payload.lensWidthMm) || 0,
      bridgeWidthMm: Number(payload.bridgeWidthMm) || 0,
      templeLengthMm: Number(payload.templeLengthMm) || 0,
      sizeLabel: payload.sizeLabel,
      price: Number(payload.price) || 0,
      quantity: Number(payload.quantity) || 0,
      status: payload.status,
      orderItemType: payload.orderItemType,
    };
    const response = await api.put(`/product-variants/${variantId}`, body);
    return response.data;
  },

  delete: async (_productId: string, variantId: string) => {
    return (await api.delete(`/product-variants/${variantId}`)).data;
  },
  getFiltered: async (productId: string, params: VariantQueryParams) => {
    const response = await api.get<VariantResponse>(`/products/${productId}/variants`, {
      params: {
        ...params,
        page: params.page ?? 0,
        size: params.size ?? 10,
        sortBy: params.sortBy ?? 'id',
        sortDir: params.sortDir ?? 'asc',
      },
    });

    // Trả về toàn bộ object result (bao gồm items, page, totalElements...)
    return response.data.result;
  },
};
