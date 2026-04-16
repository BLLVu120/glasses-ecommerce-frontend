import { useCartStore } from '@/features/cart/store/useCartStore';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCheckoutStore } from './useCheckoutStore';
import type { OrderDetailsData } from '../type/type'; // Đổi đường dẫn type
import { paymentApi } from '../api/checkout-api';

export const useOrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  const resetCheckout = useCheckoutStore((state) => state.resetCheckout);

  // Thêm state để quản lý loading và data
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderDetailsData | null>(null);

  // Lấy dữ liệu từ URL
  const orderId = searchParams.get('orderId') || '#UNKNOWN';
  const email = searchParams.get('email') || 'customer@example.com';

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        // Gọi API lấy thông tin đơn hàng
        const data = await paymentApi.getOrderDetails(orderId);
        if (data?.result) {
          setOrderData(data.result);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
      } finally {
        setIsLoading(false);
        // Cleanup cart sau khi đã lấy xong data để tránh mất dữ liệu quá sớm
        clearCart();
        resetCheckout();
      }
    };

    if (orderId !== '#UNKNOWN') {
      fetchOrderDetails();
    } else {
      setIsLoading(false);
      clearCart();
      resetCheckout();
    }
  }, [orderId, clearCart, resetCheckout]);

  // Logic tính ngày giao hàng (Dịch sang tiếng Việt cho đồng bộ UI)
  const deliveryDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      month: 'numeric',
      day: 'numeric',
    });
  }, []);

  return {
    orderId,
    email,
    deliveryDate,
    isLoading,
    orderData, // Trả orderData ra cho component dùng
  };
};
