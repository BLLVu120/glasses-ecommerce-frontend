import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';

export default function ProductInfo({ productId }: { productId: string }) {
  // 1. Gọi Hook để lấy dữ liệu
  const { data: product, isLoading, isError } = useProduct(productId);

  // 2. Xử lý trạng thái đang tải (Loading)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A8795]" />
        <p className="text-sm text-gray-500 mt-2">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  // 3. Xử lý trạng thái lỗi (Error)
  if (isError || !product) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.
      </div>
    );
  }

  // 4. Render dữ liệu thật từ API
  return (
    <div className="space-y-6">
      {/* Badges & Title */}
      <div>
        <div className="flex gap-2 mb-3">
          <Badge
            variant="secondary"
            className="bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-md px-2.5 uppercase"
          >
            {product.category}
          </Badge>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">{product.name}</h1>
        <p className="text-gray-500 italic">
          {product.brand} — {product.frameMaterial} và {product.shape}
        </p>
      </div>

      {/* Price - Hiển thị khoảng giá từ API */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-[#4A8795]">
          {(product.minPrice ?? 0).toLocaleString()}₫
        </span>
        {product.maxPrice != null &&
          product.minPrice != null &&
          product.maxPrice > product.minPrice && (
            <span className="text-lg text-gray-400 line-through decoration-gray-300">
              {product.maxPrice.toLocaleString()}₫
            </span>
          )}
      </div>
    </div>
  );
}
