<script>
  import Button from './ui/Button.svelte';
  import Input from './ui/Input.svelte';
  import Modal from './ui/Modal.svelte';
  import Toast from './ui/Toast.svelte';
  import { cartStore } from '../stores/cart.svelte';
  import { settingsStore } from '../stores/settings.svelte';
  import { onMount } from 'svelte';

  let showCartModal = $state(false);
  let showPaymentModal = $state(false);
  let paymentMethod = $state('cash');
  let cashReceived = $state('');
  let isMobile = $state(false);
  let lastOrder = $state(null);

  const formatCurrency = (amount) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  const change = $derived(paymentMethod === 'cash' ? Math.max(0, parseFloat(cashReceived) - cartStore.total) : 0);

  function openCart() { showCartModal = true; }
  function closeCart() { showCartModal = false; }
  function openPayment() { showCartModal = false; showPaymentModal = true; }
  function closePayment() { showPaymentModal = false; paymentMethod = 'cash'; cashReceived = ''; }

  function checkout() {
    const order = {
      id: crypto.randomUUID(),
      items: [...cartStore.items],
      subtotal: cartStore.subtotal,
      tax: cartStore.tax,
      total: cartStore.total,
      paymentMethod,
      cashReceived: paymentMethod === 'cash' ? parseFloat(cashReceived) : null,
      change: paymentMethod === 'cash' ? change : null,
      timestamp: Date.now()
    };
    lastOrder = order;
    cartStore.clear();
    closePayment();
    showReceipt(order);
  }

  function showReceipt(order) {
    const receiptHtml = generateReceipt(order);
    const win = window.open('', '_blank');
    win.document.write(receiptHtml);
    win.document.close();
    win.print();
  }

  function generateReceipt(order) {
    const date = new Date(order.timestamp).toLocaleString('de-DE');
    const itemsHtml = order.items.map(i => 
      `<tr><td>${i.name}</td><td style="text-align:right">${i.quantity} × ${formatCurrency(i.price)}</td><td style="text-align:right">${formatCurrency(i.price * i.quantity)}</td></tr>`
    ).join('');
    
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Bon #${order.id.slice(0,8)}</title>
<style>
body{font-family:monospace;font-size:12px;padding:20px;max-width:300px;margin:0 auto}
table{width:100%;border-collapse:collapse}.totals td{padding:4px 0}
.hr{border-top:1px dashed #000;margin:8px 0}@media print{button{display:none}}
</style></head><body>
<div style="text-align:center;margin-bottom:16px"><strong>Loes POS</strong><br>Musterstraße 1 · 12345 Musterstadt</div>
<div class="hr"></div>
<table><thead><tr><th style="text-align:left">Artikel</th><th style="text-align:right">Preis</th><th style="text-align:right">Summe</th></tr></thead>
<tbody>${itemsHtml}</tbody></table>
<div class="hr"></div>
<table class="totals"><tr><td>Zwischensumme</td><td style="text-align:right">${formatCurrency(order.subtotal)}</td></tr>
<tr><td>MwSt (${settingsStore.taxRate}%)</td><td style="text-align:right">${formatCurrency(order.tax)}</td></tr>
<tr><td><strong>Gesamt</strong></td><td style="text-align:right"><strong>${formatCurrency(order.total)}</strong></td></tr></table>
<div class="hr"></div>
<div style="text-align:center;margin-top:8px"><small>Bezahlart: ${order.paymentMethod === 'cash' ? 'Bar' : 'Karte'}${order.paymentMethod === 'cash' ? ` · Erhalten: ${formatCurrency(order.cashReceived)} · Rückgeld: ${formatCurrency(order.change)}` : ''}</small><br>
<small>Bon #${order.id.slice(0,8)} · ${date}</small></div>
<button onclick="window.print()">Drucken</button></body></html>`;
  }

  onMount(() => {
    const check = () => { isMobile = window.innerWidth < 1024; };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  });
</script>

{#if isMobile}
  <button
    class="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-3 bg-white border-t border-gray-200 px-4 py-3 shadow-lg dark:border-gray-800 dark:bg-gray-900 safe-area-inset-bottom"
    onclick={openCart}
    aria-label="Warenkorb öffnen"
  >
    <div class="flex-1 text-left">
      <p class="text-sm font-medium text-gray-900 dark:text-white">{cartStore.count} Artikel</p>
      <p class="text-lg font-bold text-blue-600 dark:text-blue-400">{formatCurrency(cartStore.total)}</p>
    </div>
    <Button variant="primary" class="w-32" size="sm">Zur Kasse</Button>
  </button>

  <Modal bind:open={showCartModal} title="Warenkorb" class="max-w-full lg:max-w-md">
    <div class="space-y-4">
      {#if cartStore.items.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
          <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <p>Warenkorb ist leer</p>
        </div>
      {:else}
        <ul class="space-y-2 max-h-[50vh] overflow-auto pr-2">
          {#each cartStore.items as item}
            <li class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(item.price)} × {item.quantity}</p>
              </div>
              <div class="flex items-center gap-2">
                <Button variant="ghost" size="sm" class="p-1" onclick={() => cartStore.setQty(item.id, item.quantity - 1)} aria-label="Menge verringern">−</Button>
                <span class="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <Button variant="ghost" size="sm" class="p-1" onclick={() => cartStore.setQty(item.id, item.quantity + 1)} aria-label="Menge erhöhen">+</Button>
                <Button variant="ghost" size="sm" class="p-1 text-red-500" onclick={() => cartStore.remove(item.id)} aria-label="Entfernen">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </Button>
              </div>
              <p class="text-right font-medium text-gray-900 dark:text-white w-20">{formatCurrency(item.price * item.quantity)}</p>
            </li>
          {/each}
        </ul>

        <div class="border-t border-gray-200 pt-4 dark:border-gray-800 space-y-2">
          <div class="flex justify-between text-sm"><span class="text-gray-600 dark:text-gray-400">Zwischensumme</span><span class="font-medium">{formatCurrency(cartStore.subtotal)}</span></div>
          <div class="flex justify-between text-sm"><span class="text-gray-600 dark:text-gray-400">MwSt ({settingsStore.taxRate}%)</span><span class="font-medium">{formatCurrency(cartStore.tax)}</span></div>
          <div class="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2 dark:border-gray-800"><span>Gesamt</span><span>{formatCurrency(cartStore.total)}</span></div>
          <Button variant="success" class="w-full mt-2" onclick={openPayment}>Zur Zahlung</Button>
        </div>
      {/if}
    </div>
  </Modal>

  <Modal bind:open={showPaymentModal} title="Bezahlen" class="max-w-full lg:max-w-md">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Zahlungsart</label>
        <div class="flex gap-2">
          <Button variant={paymentMethod === 'cash' ? 'primary' : 'secondary'} class="flex-1" onclick={() => paymentMethod = 'cash'}>Bar</Button>
          <Button variant={paymentMethod === 'card' ? 'primary' : 'secondary'} class="flex-1" onclick={() => paymentMethod = 'card'}>Karte</Button>
        </div>
      </div>
      {#if paymentMethod === 'cash'}
        <Input label="Erhalten" type="number" step="0.01" bind:value={cashReceived} placeholder="0.00" inputmode="decimal" />
        <div class="flex justify-between text-lg font-semibold"><span>Rückgeld</span><span class="text-green-600">{formatCurrency(change)}</span></div>
      {/if}
      <div class="flex gap-2 pt-2">
        <Button variant="secondary" class="flex-1" onclick={closePayment}>Abbrechen</Button>
        <Button variant="success" class="flex-1" onclick={checkout} disabled={paymentMethod === 'cash' && change < 0 || cartStore.items.length === 0}>Abschließen & Bon drucken</Button>
      </div>
    </div>
  </Modal>

  {#if lastOrder}
    <Toast type="success" message="Verkauf abgeschlossen! Bon wird gedruckt." onClose={() => lastOrder = null} />
  {/if}
{:else}
  <aside class="w-full lg:w-80 border-l border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-auto">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Warenkorb ({cartStore.count})</h2>
      {#if cartStore.items.length}
        <Button variant="ghost" size="sm" onclick={() => cartStore.clear()}>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          Leeren
        </Button>
      {/if}
    </div>

    {#if cartStore.items.length === 0}
      <div class="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        <svg class="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        <p>Warenkorb ist leer</p>
      </div>
    {:else}
      <ul class="space-y-2 max-h-[400px] overflow-auto mb-4">
        {#each cartStore.items as item}
          <li class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(item.price)} × {item.quantity}</p>
            </div>
            <div class="flex items-center gap-2">
              <Button variant="ghost" size="sm" class="p-1" onclick={() => cartStore.setQty(item.id, item.quantity - 1)} aria-label="Menge verringern">−</Button>
              <span class="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <Button variant="ghost" size="sm" class="p-1" onclick={() => cartStore.setQty(item.id, item.quantity + 1)} aria-label="Menge erhöhen">+</Button>
              <Button variant="ghost" size="sm" class="p-1 text-red-500" onclick={() => cartStore.remove(item.id)} aria-label="Entfernen">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </Button>
            </div>
            <p class="text-right font-medium text-gray-900 dark:text-white w-20">{formatCurrency(item.price * item.quantity)}</p>
          </li>
        {/each}
      </ul>

      <div class="border-t border-gray-200 pt-4 dark:border-gray-800 space-y-2">
        <div class="flex justify-between text-sm"><span class="text-gray-600 dark:text-gray-400">Zwischensumme</span><span class="font-medium">{formatCurrency(cartStore.subtotal)}</span></div>
        <div class="flex justify-between text-sm"><span class="text-gray-600 dark:text-gray-400">MwSt ({settingsStore.taxRate}%)</span><span class="font-medium">{formatCurrency(cartStore.tax)}</span></div>
        <div class="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2 dark:border-gray-800"><span>Gesamt</span><span>{formatCurrency(cartStore.total)}</span></div>
        <Button variant="success" class="w-full mt-4" onclick={openPayment}>Zur Kasse</Button>
      </div>
    {/if}
  </aside>

  <Modal bind:open={showPaymentModal} title="Bezahlen" class="max-w-full lg:max-w-md">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Zahlungsart</label>
        <div class="flex gap-2">
          <Button variant={paymentMethod === 'cash' ? 'primary' : 'secondary'} class="flex-1" onclick={() => paymentMethod = 'cash'}>Bar</Button>
          <Button variant={paymentMethod === 'card' ? 'primary' : 'secondary'} class="flex-1" onclick={() => paymentMethod = 'card'}>Karte</Button>
        </div>
      </div>
      {#if paymentMethod === 'cash'}
        <Input label="Erhalten" type="number" step="0.01" bind:value={cashReceived} placeholder="0.00" inputmode="decimal" />
        <div class="flex justify-between text-lg font-semibold"><span>Rückgeld</span><span class="text-green-600">{formatCurrency(change)}</span></div>
      {/if}
      <div class="flex gap-2 pt-2">
        <Button variant="secondary" class="flex-1" onclick={() => showPaymentModal = false}>Abbrechen</Button>
        <Button variant="success" class="flex-1" onclick={checkout} disabled={paymentMethod === 'cash' && change < 0 || cartStore.items.length === 0}>Abschließen & Bon drucken</Button>
      </div>
    </div>
  </Modal>

  {#if lastOrder}
    <Toast type="success" message="Verkauf abgeschlossen! Bon wird gedruckt." onClose={() => lastOrder = null} />
  {/if}
{/if}