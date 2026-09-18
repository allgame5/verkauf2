const browser = typeof window !== 'undefined';

export interface CartItem {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

function load(): CartItem[] {
  if (!browser) return [];
  try {
    const data = localStorage.getItem('pos_cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function save(cart: CartItem[]) {
  if (!browser) return;
  localStorage.setItem('pos_cart', JSON.stringify(cart));
}

const cart = $state<CartItem[]>(load());

const subtotal = $derived(cart.reduce((sum, i) => sum + i.price * i.quantity, 0));
const tax = $derived(subtotal * 0.19);
const total = $derived(subtotal + tax);
const count = $derived(cart.reduce((sum, i) => sum + i.quantity, 0));

export const cartStore = {
  get items() { return cart; },
  get subtotal() { return subtotal; },
  get tax() { return tax; },
  get total() { return total; },
  get count() { return count; },
  add(item: { id: string; name: string; price: number }, qty = 1) {
    const existing = cart.find(c => c.itemId === item.id);
    if (existing) { existing.quantity += qty; }
    else { cart.push({ id: crypto.randomUUID(), itemId: item.id, name: item.name, price: item.price, quantity: qty }); }
    save(cart);
  },
  remove(id: string) {
    const idx = cart.findIndex(c => c.id === id);
    if (idx >= 0) { cart.splice(idx, 1); save(cart); }
  },
  setQty(id: string, qty: number) {
    const item = cart.find(c => c.id === id);
    if (item) { item.quantity = Math.max(1, qty); save(cart); }
  },
  clear() { cart.length = 0; save(cart); }
};