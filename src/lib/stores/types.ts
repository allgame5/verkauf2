export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  sortOrder: number;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  image?: string;
  description?: string;
  taxRate: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
}

export interface CartItem {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  taxRate: number;
  discount?: number;
  note?: string;
  isCustom: boolean;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentDetails: PaymentDetails;
  status: 'completed' | 'refunded' | 'voided';
  createdAt: number;
  completedAt?: number;
  receiptNumber: string;
  customerEmail?: string;
  customerPhone?: string;
}

export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'split';

export interface PaymentDetails {
  cash?: {
    received: number;
    change: number;
  };
  card?: {
    last4?: string;
    type?: string;
  };
  mobile?: {
    provider: string;
  };
  split?: Array<{
    method: PaymentMethod;
    amount: number;
    details?: Record<string, unknown>;
  }>;
}

export interface Settings {
  currency: string;
  locale: string;
  taxRate: number;
  taxIncluded: boolean;
  receiptHeader: string;
  receiptFooter: string;
  printerType: 'browser' | 'thermal' | 'none';
  printerConfig?: Record<string, unknown>;
  autoPrintReceipt: boolean;
  enableSounds: boolean;
  enableHaptics: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}