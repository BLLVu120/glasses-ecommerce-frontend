import type { OrderDetail } from '@/features/operation-staff/types/types';

export const mockOrderDetails: Record<string, OrderDetail> = {
  '1': {
    id: '1',
    orderCode: '#ORD-2602-001',
    customerName: 'Nguyễn Văn A',
    sla: 'Còn 2 giờ',
    slaHours: 2,
    priority: 'high',
    productName: 'Gọng Titan + Tròng 1.6',
    productType: 'Cắt ánh sáng xanh · Chống vỡ',
    productFeatures: 'Premium lens',
    productIcon: 'glasses',
    paymentStatus: 'deposit_50',
    status: 'waiting_cutting',
    isActionable: true,
    receivedTime: '10:30 AM - 26/02/2024',
    pickingItems: [
      {
        id: 'frame-1',
        type: 'frame',
        name: 'Gọng Titan T01 - Màu Đen',
        sku: 'GT-T01-BLK',
        quantity: 1,
        location: 'Kệ A1 - Tầng 2',
        locationType: 'shelf',
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA5DKaYtinaxneCfbfJ4nTl44qyrd1mylVFsGtLRRM2iZl11ABhQaHiQ0dVrMROnfy-4ilYN2hidwHRmIsmcP37qVGUl-cIFDG_wVcS2GoLRBO2ciOPZzRHK9ZFH1aScYnrRGCwA5k2THqi9wmZHWmYyU426Rh6Fsw84P7d5qEDMsxxa2Vpkn6lrJhdbO49B625jTZJrc3e30_8hez6Hb9IZW2j4cDvSncHN-ea-DX79rN-Tub42VjPvO78nvleh4io6lWUg2X4BTU',
      },
      {
        id: 'lens-1',
        type: 'lens',
        name: 'Tròng Chemi 1.60 U2',
        sku: 'CH-160-U2',
        quantity: 1,
        location: 'Tủ T1 - Ngăn Cận Loạn',
        locationType: 'cabinet',
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCOAcaIDMTSI2pzL8eqtaIU_77LGQR3GYN9GqCQXuQN5Abt6gAFeQuErKKw_NB87eyGuIf76QsCmTxEQ6gyVyQcDH20mc5eoLcTHikgE-Jfr2QLCIQt2xbaQWJaqrsIoc8fzqDVfJ64ZpNyafpTidZw3RZmSASQNmi_0j9OvAcqA5RNyIM53UwRWrp1W_La8P8BGAFxebFZH10ku2kDTQQvFEI3O0146JYO1z_Dm1W9JzV8GwOsV_DfPJkenEIAyQoZICF55xe7lRU',
      },
    ],
    prescription: {
      od: {
        sphere: -2.0,
        cylinder: -0.75,
        axis: 90,
        pd: 31,
      },
      os: {
        sphere: -1.5,
        cylinder: 0.0,
        axis: 0,
        pd: 31,
      },
    },
    salesNotes: [
      {
        id: 'note-1',
        type: 'warning',
        title: 'Ghi chú Sales quan trọng',
        message: 'Khách mặt to, vui lòng nắn rộng càng kính!',
        priority: 'high',
      },
    ],
    processingStatus: 'pending',
  },
};
