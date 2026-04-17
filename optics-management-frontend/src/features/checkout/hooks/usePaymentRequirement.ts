import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { paymentApi } from '../api/checkout-api';

export const usePaymentRequirement = () => {
  const { items } = useCartStore();

  // Chuyển đổi dữ liệu từ Cart Store sang định dạng API yêu cầu
  const payload = {
    items: items.map((item) => ({
      productVariantId: item.productId, // ID của variant sản phẩm
      lensId: item.lensId || null, // ID của tròng kính (nếu có)
      quantity: item.quantity,
    })),
  };

  return useQuery({
    queryKey: ['payment-requirement', payload],
    queryFn: () => paymentApi.getPaymentRequirement(payload),
    // Chỉ fetch khi giỏ hàng có ít nhất 1 sản phẩm
    enabled: items.length > 0,
    // Tránh fetch lại quá nhiều khi người dùng đang thao tác
    staleTime: 1000 * 30,
  });
};
