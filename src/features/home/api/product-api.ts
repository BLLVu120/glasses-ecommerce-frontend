import { api } from '@/lib/axios';
import type { ApiResponse } from '@/features/auth/types';
import type {
  FilterParams,
  GetFilteredProductsResponse,
  GetVariantsResponse,
  Product,
  ProductVariant,
} from '../types/product-type';
    const { data } = await api.get<ApiResponse<Product[]>>('/products');

export const productApi = {
  getAllProducts: async () => {
    // 👇 Destructuring: Chỉ lấy phần 'data' từ Axios Response
    const { data } = await api.get<ApiResponse<Product[]>>('/products');

    // Trả về đúng object: { code: number, result: Product[] }
    return data;
  },


  export const productApi = {
  getAllProducts: async () => {
    // 👇 Destructuring: Chỉ lấy phần 'data' từ Axios Response
    const { data } = await api.get<ApiResponse<Product[]>>('/products');

    // Trả về đúng object: { code: number, result: Product[] }
    return data;
  },

  getProductById: async (id: string) => {
    // 👇 Tương tự cho chi tiết sản phẩm
    const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);

    // Trả về đúng object: { code: number, result: Product }
    return data;
  },
  getVariants: async (productId: string): Promise<ProductVariant[]> => {
    const response = await api.get<GetVariantsResponse>(`/products/${productId}/variants`, {
      params: {
        page: 0,
        size: 10,
        status: 'ACTIVE',
        sortBy: 'id',
        sortDir: 'asc',
      },
    });
    return response.data?.result?.items ?? [];
  },
  getFilteredProducts: async (params: FilterParams) => {
    // Gọi đúng endpoint /products/filter như curl của bạn
    const response = await api.get<GetFilteredProductsResponse>('/products/filter', {
      params: {
        status: 'ACTIVE', // Mặc định chỉ lấy hàng ACTIVE
        ...params, // Ghi đè sortBy, sortDir truyền từ UI vào
      },
    });
    return response.data;
  },

  getProductFeedback: async (productId: string) => {
    const response = await api.get(`/feedbacks/product/${productId}`);
    return response.data?.result ?? [];
  },
};
