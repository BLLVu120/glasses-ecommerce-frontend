import { create } from 'zustand';

interface EyeSpecs {
  sphere: string;
  cylinder: string;
  axis: string;
  add: string;
  pd: string;
}

interface PrescriptionData {
  od: EyeSpecs;
  os: EyeSpecs;
  imageUrl: string | null;
  notes: string;
}

interface PrescriptionState {
  // Trạng thái đơn hàng
  orderType: 'buy-now' | 'pre-order' | 'custom';
  selectedLensId: string | null;

  // Dữ liệu độ cận
  prescription: PrescriptionData;

  // Actions
  setOrderType: (type: 'buy-now' | 'pre-order' | 'custom') => void;
  setLensId: (id: string | null) => void;
  // Thay đổi 'any' bằng Partial<PrescriptionData>
  updatePrescription: (data: Partial<PrescriptionData>) => void;
  resetPrescription: () => void;
}

const initialPrescription: PrescriptionData = {
  od: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
  os: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
  imageUrl: null,
  notes: '',
};

export const usePrescriptionStore = create<PrescriptionState>((set) => ({
  orderType: 'buy-now',
  selectedLensId: 'standard',
  prescription: initialPrescription,

  setOrderType: (type) => set({ orderType: type }),
  setLensId: (id: string | null) => set({ selectedLensId: id }),

  // Logic cập nhật an toàn
  updatePrescription: (data) =>
    set((state) => ({
      prescription: { ...state.prescription, ...data },
    })),

  resetPrescription: () =>
    set({
      prescription: initialPrescription,
      selectedLensId: null,
      orderType: 'buy-now',
    }),
}));
