import { useState } from 'react';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { useCheckoutStore } from '@/features/checkout/store/useCheckoutStore';
import { toast } from 'sonner';
import axios from 'axios';
import { paymentApi } from '../api/checkout-api';

export const useCheckoutFlow = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { step, setStep, nextStep, prevStep, shippingData, paymentMethod, bankInfo } =
    useCheckoutStore();
  const { items, clearCart } = useCartStore();

  const submitOrder = async () => {
    const toastId = toast.loading('Đang khởi tạo đơn hàng...');

    try {
      setIsSubmitting(true);

      // --- VALIDATION NHANH ---
      if (!shippingData.phone || !shippingData.address || !shippingData.name) {
        toast.error('Thiếu thông tin giao hàng', {
          id: toastId,
          description: 'Vui lòng kiểm tra lại họ tên, số điện thoại và địa chỉ, cũng như thông tin ngân hàng nếu chọn thanh toán chuyển khoản.',
        });
        setIsSubmitting(false);
        setStep(1);
        return;
      }

      const isValueEmpty = (val: unknown) => {
        if (val === null || val === undefined) return true;
        const strVal = String(val).trim().toLowerCase();
        return ['', '0', '0.00', '+0.00', '-0.00', '0.0', 'plan', 'none'].includes(strVal);
      };

      const hasPrescriptionData = (prescription: (typeof items)[number]['prescription']) => {
        if (!prescription) return false;
        if (prescription.imageUrl) return true;
        if (prescription.notes && String(prescription.notes).trim() !== '') return true;

        const odHasData = Boolean(
          prescription.od && Object.values(prescription.od).some((val) => !isValueEmpty(val)),
        );
        const osHasData = Boolean(
          prescription.os && Object.values(prescription.os).some((val) => !isValueEmpty(val)),
        );

        return odHasData || osHasData;
      };

      const hasLensButMissingPrescription = items.some(
        (item) => item.lensId && !hasPrescriptionData(item.prescription),
      );

      if (hasLensButMissingPrescription) {
        toast.error('Thiếu đơn bác sĩ', {
          id: toastId,
          description: 'Khi chọn tròng kính, bạn cần nhập thông số mắt hoặc tải lên ảnh đơn thuốc trước khi thanh toán.',
        });
        setIsSubmitting(false);
        setStep(3);
        return;
      }
      if (
        !bankInfo?.bankName ||
        !bankInfo?.bankAccountNumber ||
        !bankInfo?.accountHolderName
      ) {
        toast.error('Thiếu thông tin giao hàng', {
          id: toastId,
          description:
            'Vui lòng kiểm tra lại thông tin ngân hàng nếu chọn thanh toán chuyển khoản.',
        });
        setIsSubmitting(false);
        setStep(2);
        return;
      }

      // --- BƯỚC 1: CHUẨN BỊ DATA ---
      const deliveryAddress = `${shippingData.address || ''}`.trim();

      const orderItems = items.map((item) => {
        let mappedPrescription = null;
        if (item.prescription) {
          const p = item.prescription;
          mappedPrescription = {
            odSphere: parseFloat(p.od?.sphere) || 0,
            odCylinder: parseFloat(p.od?.cylinder) || 0,
            odAxis: parseFloat(p.od?.axis) || 0,
            odAdd: parseFloat(p.od?.add) || 0,
            odPd: parseFloat(p.od?.pd) || 0,
            osSphere: parseFloat(p.os?.sphere) || 0,
            osCylinder: parseFloat(p.os?.cylinder) || 0,
            osAxis: parseFloat(p.os?.axis) || 0,
            osAdd: parseFloat(p.os?.add) || 0,
            osPd: parseFloat(p.os?.pd) || 0,
            note: p.notes || '',
          };
        }
        return {
          productVariantId: item.productId,
          quantity: item.quantity,
          lensId: item.lensId || null,
          prescription: mappedPrescription,
        };
      });

      const validBankInfo =
        bankInfo?.bankName && bankInfo?.bankAccountNumber && bankInfo?.accountHolderName
          ? bankInfo
          : null;

      const orderInfo = {
        deliveryAddress: deliveryAddress,
        recipientName: shippingData.name,
        phoneNumber: shippingData.phone,
        items: orderItems,
        comboId: null,
        bankInfo: validBankInfo,
      };

      const formData = new FormData();
      formData.append('orderInfo', JSON.stringify(orderInfo));

      // --- XỬ LÝ ẢNH ---
      const itemWithImage = items.find((item) => item.prescription?.imageUrl);
      const imageUrl = itemWithImage?.prescription?.imageUrl;

      if (imageUrl && imageUrl.startsWith('data:image/')) {
        const response = await fetch(imageUrl);
        const blobData = await response.blob();
        formData.append('prescriptionImage', blobData, 'prescription.jpg');
      } else {
        formData.append('prescriptionImage', '');
      }

      // --- BƯỚC 2: TẠO ĐƠN HÀNG (SỬ DỤNG API ĐÃ TÁCH) ---
      const orderResponseData = await paymentApi.createOrder(formData, paymentMethod);
      const actualOrderId = orderResponseData?.result?.orderId || orderResponseData?.orderId;

      if (!actualOrderId) throw new Error('Không lấy được mã đơn hàng.');

      // --- BƯỚC 3: XỬ LÝ THANH TOÁN (SỬ DỤNG API ĐÃ TÁCH) ---
      if (paymentMethod === 'VNPAY') {
        toast.loading('Đang kết nối cổng thanh toán VNPay...', { id: toastId });

        const paymentResponseData = await paymentApi.checkoutVnpay(actualOrderId);
        const paymentUrl = paymentResponseData?.result || paymentResponseData;

        if (paymentUrl && typeof paymentUrl === 'string') {
          clearCart();
          setTimeout(() => {
            window.location.href = paymentUrl;
          }, 1000);
        } else {
          toast.error('Lỗi cổng thanh toán VNPay', { id: toastId });
          setIsSubmitting(false);
        }
      } else {
        clearCart();
        toast.success('Đặt hàng thành công!', {
          id: toastId,
          description: 'Cảm ơn bạn đã mua hàng. Chúng tôi sẽ sớm liên hệ!',
        });

        setTimeout(() => {
          setIsSubmitting(false);
          window.location.href = '/';
        }, 2000);
      }
    } catch (error: unknown) {
      console.error('Checkout Error:', error);

      let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại sau.';

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error('Đặt hàng thất bại', {
        id: toastId,
        description: errorMessage,
      });
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (step < 3) {
      nextStep();
    } else {
      submitOrder();
    }
  };

  return {
    step,
    setStep,
    handleContinue,
    handleBack: prevStep,
    isSubmitting,
  };
};
