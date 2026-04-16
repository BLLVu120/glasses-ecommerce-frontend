// src/features/products/api/product-api.ts
import { api } from '@/lib/axios';
import type { PaginatedResponse, Product, ProductQueryParams } from '../types/types';
export const productApi = {
  // Lấy danh sách
  getAll: async () => {
    const response = await api.get('/products');
    return response.data as { result: Product[] };
  },

  create: async ({ productData, files, modelFile }: { productData: any; files?: File[]; modelFile?: File | null }) => {
    const formData = new FormData();

    // 1. Trích xuất và ép kiểu các trường
    const formattedProduct = {
      name: productData.name,
      brand: productData.brand,
      category: productData.category, 
      frameType: productData.frameType,
      gender: productData.gender,
      shape: productData.shape,
      frameMaterial: productData.frameMaterial,
      hingeType: productData.hingeType,
      nosePadType: productData.nosePadType,
      weightGram: Number(productData.weightGram || 0),
      status: productData.status || "ACTIVE",
    };

    // 2. Append JSON string
    formData.append('product', JSON.stringify(formattedProduct));

    // 3. QUAN TRỌNG: Lặp qua mảng files để append nhiều ảnh (cùng key 'files')
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file);
      });
    }

    // 4. Gửi request
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const createdProduct = response.data.result;
    const productId = createdProduct.id || createdProduct._id;

    // 5. Tải lên 3D model
    if (productId && modelFile && modelFile instanceof File && modelFile.size > 0) {
      try {
        const modelFormData = new FormData();
        modelFormData.append('file', modelFile); 
        await api.post(`/products/${productId}/model`, modelFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (err: any) {
        console.warn('⚠️ Failed to upload 3D model:', err?.response?.data || err.message);
      }
    }

    return createdProduct;
  },

  update: async (id: string, { productData, modelFile }: { productData: any; files?: File[]; modelFile?: File | null })=> {
    const formattedProduct = {
      name: productData.name,
      brand: productData.brand,
      category: productData.category,
      frameType: productData.frameType,
      gender: productData.gender,
      shape: productData.shape,
      frameMaterial: productData.frameMaterial,
      hingeType: productData.hingeType,
      nosePadType: productData.nosePadType,
      weightGram: Number(productData.weightGram),
      status: productData.status,
      modelUrl: productData.modelUrl,
      imageUrl: Array.isArray(productData.imageUrl) 
        ? productData.imageUrl.map((img: any) => typeof img === 'string' ? img : (img.imageUrl ?? ''))
        : []
    };

    // Update product data via PUT
    const response = await api.put(`/products/${id}`, formattedProduct);

    // If a new 3D model file was selected, upload it via separate endpoint
    if (modelFile && modelFile instanceof File && modelFile.size > 0) {
      try {
        const modelFormData = new FormData();
        modelFormData.append('file', modelFile);
        await api.post(`/products/${id}/model`, modelFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } catch (err: any) {
        console.warn('⚠️ Failed to upload 3D model (product update still saved):', err?.response?.data || err.message);
      }
    }

    return response.data;
  },
  // Xóa sản phẩm
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getFiltered: async (params: ProductQueryParams) => {
    const response = await api.get<PaginatedResponse<Product>>('/products/filter', {
      params: {
        ...params,
        // Đảm bảo default values nếu cần
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    });
    return response.data.result; // Trả về object chứa { items, totalPages, ... }
  },
};
