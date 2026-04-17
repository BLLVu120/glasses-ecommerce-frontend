import { create } from 'zustand';
import type { CheckoutState, BankInfo } from '../type/type'; // Import thêm BankInfo

// ==========================================
// KHỞI TẠO STORE
// ==========================================
export const useCheckoutStore = create<CheckoutState>((set) => ({
  step: 1,

  // Khởi tạo giá trị mặc định
  shippingData: {
    name: '',
    address: '',
    phone: '',
    email: '',
  },
  paymentMethod: 'VNPAY',
  bankInfo: {
    bankName: '',
    bankAccountNumber: '',
    accountHolderName: '',
  },

  // Định nghĩa rõ kiểu number cho tham số step
  setStep: (step: number) => set({ step }),

  nextStep: () =>
    set((state) => ({
      step: Math.min(state.step + 1, 3),
    })),

  prevStep: () =>
    set((state) => ({
      step: Math.max(state.step - 1, 1),
    })),

  // Định nghĩa rõ kiểu Partial cho data
  updateShippingData: (data: Partial<CheckoutState['shippingData']>) =>
    set((state) => ({
      shippingData: { ...state.shippingData, ...data },
    })),

  // Định nghĩa rõ kiểu string cho method
  setPaymentMethod: (method: string) => set({ paymentMethod: method }),

  // Cập nhật dữ liệu bankInfo (Định nghĩa rõ Partial<BankInfo>)
  updateBankInfo: (data: Partial<BankInfo>) =>
    set((state) => ({
      bankInfo: state.bankInfo
        ? { ...state.bankInfo, ...data }
        : { bankName: '', bankAccountNumber: '', accountHolderName: '', ...data },
    })),

  // Reset về trạng thái ban đầu
  resetCheckout: () =>
    set({
      step: 1,
      shippingData: {
        name: '',
        address: '',
        phone: '',
      },
      paymentMethod: 'VNPAY',
      bankInfo: {
        bankName: '',
        bankAccountNumber: '',
        accountHolderName: '',
      },
    }),
}));
