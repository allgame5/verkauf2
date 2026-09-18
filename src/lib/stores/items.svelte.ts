const browser = typeof window !== 'undefined';

export interface Item {
  id: string;
  name: string;
  price: number;
  category: string;
}

const DEFAULT_ITEMS: Item[] = [
  { id: '1', name: 'Kaffee', price: 2.50, category: 'Getränke' },
  { id: '2', name: 'Cappuccino', price: 3.00, category: 'Getränke' },
  { id: '3', name: 'Wasser', price: 1.50, category: 'Getränke' },
  { id: '4', name: 'Cola', price: 2.00, category: 'Getränke' },
  { id: '5', name: 'Brötchen', price: 3.50, category: 'Essen' },
  { id: '6', name: 'Currywurst', price: 4.50, category: 'Essen' },
  { id: '7', name: 'Pommes', price: 3.00, category: 'Essen' },
  { id: '8', name: 'Schoki', price: 1.20, category: 'Snacks' },
  { id: '9', name: 'Chips', price: 1.50, category: 'Snacks' },
];

function load(): Item[] {
  if (!browser) return DEFAULT_ITEMS;
  try { const data = localStorage.getItem('pos_items'); return data ? JSON.parse(data) : DEFAULT_ITEMS; } catch { return DEFAULT_ITEMS; }
}

function save(items: Item[]) { if (!browser) return; localStorage.setItem('pos_items', JSON.stringify(items)); }

const items = $state<Item[]>(load());
const categories = $derived(Array.from(new Set(items.map(i => i.category))).sort());
const byCategory = $derived.by(() => {
  const map: Record<string, Item[]> = {};
  for (const item of items) { (map[item.category] ??= []).push(item); }
  return map;
});

export const itemsStore = {
  get all() { return items; },
  get categories() { return categories; },
  get byCategory() { return byCategory; },
  add(item: Omit<Item, 'id'>) { const newItem = { ...item, id: crypto.randomUUID() }; items.push(newItem); save(items); },
  remove(id: string) { const idx = items.findIndex(i => i.id === id); if (idx >= 0) { items.splice(idx, 1); save(items); } },
  update(id: string, data: Partial<Item>) { const idx = items.findIndex(i => i.id === id); if (idx >= 0) { items[idx] = { ...items[idx], ...data }; save(items); } }
};