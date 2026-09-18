import type { Item, Category, Settings, Transaction } from '../stores/types';

const STORAGE_KEYS = {
  items: 'pos_items',
  categories: 'pos_categories',
  settings: 'pos_settings',
  cart: 'pos_cart',
  lastReceiptNumber: 'pos_last_receipt'
} as const;

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Getränke', icon: 'Coffee', color: '#3b82f6', sortOrder: 1 },
  { id: 'cat-2', name: 'Speisen', icon: 'Utensils', color: '#22c55e', sortOrder: 2 },
  { id: 'cat-3', name: 'Snacks', icon: 'Cookie', color: '#f59e0b', sortOrder: 3 },
  { id: 'cat-4', name: 'Sonstiges', icon: 'Package', color: '#6b7280', sortOrder: 4 }
];

const DEFAULT_ITEMS: Item[] = [
  { id: 'item-1', name: 'Kaffee', price: 2.50, categoryId: 'cat-1', taxRate: 19, isActive: true, sortOrder: 1, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'item-2', name: 'Cappuccino', price: 3.00, categoryId: 'cat-1', taxRate: 19, isActive: true, sortOrder: 2, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'item-3', name: 'Wasser 0.5L', price: 1.50, categoryId: 'cat-1', taxRate: 19, isActive: true, sortOrder: 3, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'item-4', name: 'Cola', price: 2.00, categoryId: 'cat-1', taxRate: 19, isActive: true, sortOrder: 4, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'item-5', name: 'Belegtes Brötchen', price: 3.50, categoryId: 'cat-2', taxRate: 19, isActive: true, sortOrder: 1, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'item-6', name: 'Currywurst', price: 4.50, categoryId: 'cat-2', taxRate: 19, isActive: true, sortOrder: 2, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'item-7', name: 'Pommes', price: 3.00, categoryId: 'cat-2', taxRate: 19, isActive: true, sortOrder: 3, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'item-8', name: 'Schokoriegel', price: 1.20, categoryId: 'cat-3', taxRate: 19, isActive: true, sortOrder: 1, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'item-9', name: 'Chips', price: 1.50, categoryId: 'cat-3', taxRate: 19, isActive: true, sortOrder: 2, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'item-10', name: 'Kaugummi', price: 0.80, categoryId: 'cat-3', taxRate: 19, isActive: true, sortOrder: 3, createdAt: Date.now(), updatedAt: Date.now() }
];

const DEFAULT_SETTINGS: Settings = {
  currency: 'EUR',
  locale: 'de-DE',
  taxRate: 19,
  taxIncluded: true,
  receiptHeader: 'Loes POS\nMusterstraße 1\n12345 Musterstadt',
  receiptFooter: 'Vielen Dank für Ihren Einkauf!\nwww.loes-pos.de',
  printerType: 'browser',
  autoPrintReceipt: false,
  enableSounds: true,
  enableHaptics: true,
  theme: 'system',
  language: 'de'
};

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch (e) {
    console.error(`Failed to load ${key} from localStorage:`, e);
  }
  return defaultValue;
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

export function getItems(): Item[] {
  return loadFromStorage<Item[]>(STORAGE_KEYS.items, DEFAULT_ITEMS);
}

export function saveItems(items: Item[]): void {
  saveToStorage(STORAGE_KEYS.items, items);
}

export function getCategories(): Category[] {
  return loadFromStorage<Category[]>(STORAGE_KEYS.categories, DEFAULT_CATEGORIES);
}

export function saveCategories(categories: Category[]): void {
  saveToStorage(STORAGE_KEYS.categories, categories);
}

export function getSettings(): Settings {
  return loadFromStorage<Settings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
}

export function saveSettings(settings: Settings): void {
  saveToStorage(STORAGE_KEYS.settings, settings);
}

export function getCart(): { items: { itemId: string; quantity: number; isCustom: boolean; name?: string; price?: number }[] } {
  return loadFromStorage(STORAGE_KEYS.cart, { items: [] });
}

export function saveCart(cart: { items: { itemId: string; quantity: number; isCustom: boolean; name?: string; price?: number }[] }): void {
  saveToStorage(STORAGE_KEYS.cart, cart);
}

export function getLastReceiptNumber(): number {
  return loadFromStorage<number>(STORAGE_KEYS.lastReceiptNumber, 0);
}

export function saveLastReceiptNumber(number: number): void {
  saveToStorage(STORAGE_KEYS.lastReceiptNumber, number);
}

export function generateReceiptNumber(): string {
  const last = getLastReceiptNumber();
  const next = last + 1;
  saveLastReceiptNumber(next);
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}-${next.toString().padStart(4, '0')}`;
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}

export function exportData(): string {
  const data = {
    items: getItems(),
    categories: getCategories(),
    settings: getSettings(),
    lastReceiptNumber: getLastReceiptNumber(),
    exportedAt: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.items) saveItems(data.items);
    if (data.categories) saveCategories(data.categories);
    if (data.settings) saveSettings(data.settings);
    if (data.lastReceiptNumber !== undefined) saveLastReceiptNumber(data.lastReceiptNumber);
    return true;
  } catch (e) {
    console.error('Failed to import data:', e);
    return false;
  }
}