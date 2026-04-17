import type { PrescriptionData } from '@/types/prescription';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  lensId?: string | null; // Luôn để null nếu không có để khớp với backend
  prescription?: PrescriptionData | null;
  orderType: 'buy-now' | 'pre-order' | 'custom';
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  clearCart: () => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getCartTotal: () => number;
  openCart: () => void;
  closeCart: () => void;
}
