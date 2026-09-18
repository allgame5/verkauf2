<script>
  import Button from './ui/Button.svelte';
  import Modal from './ui/Modal.svelte';
  import { cartStore } from '../stores/cart.svelte';
  import { settingsStore } from '../stores/settings.svelte';

  let showCheckout = $state(false);
  let paymentMethod = $state<'cash' | 'card'>('cash');
  let cashReceived = $state('');
  let change = $derived(paymentMethod === 'cash' ? Math.max(0, parseFloat(cashReceived) - cartStore.total) : 0);

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  }

  function checkout() {
    // In a real app, this would send to a backend
    cartStore.clear();
    showCheckout = false;
    cashReceived = '';
    paymentMethod = 'cash';
    alert('Verkauf abgeschlossen! Bon wird gedruckt.');
  }
</script>

<aside class="w-full lg:w-80 border-l border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
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
      <div class="flex justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">Zwischensumme</span>
        <span class="font-medium">{formatCurrency(cartStore.subtotal)}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">MwSt ({settingsStore.taxRate}%)</span>
        <span class="font-medium">{formatCurrency(cartStore.tax)}</span>
      </div>
      <div class="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2 dark:border-gray-800">
        <span>Gesamt</span>
        <span>{formatCurrency(cartStore.total)}</span>
      </div>

      <Button variant="success" class="w-full mt-4" onclick={() => showCheckout = true}>Zur Kasse</Button>
    </div>
  {/if}
</aside>

<Modal bind:open={showCheckout} title="Bezahlen">
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2">Zahlungsart</label>
      <div class="flex gap-2">
        <Button variant={paymentMethod === 'cash' ? 'primary' : 'secondary'} class="flex-1" onclick={() => paymentMethod = 'cash'}>Bar</Button>
        <Button variant={paymentMethod === 'card' ? 'primary' : 'secondary'} class="flex-1" onclick={() => paymentMethod = 'card'}>Karte</Button>
      </div>
    </div>

    {#if paymentMethod === 'cash'}
      <Input label="Erhalten" type="number" step="0.01" bind:value={cashReceived} placeholder="0.00" />
      <div class="flex justify-between text-lg font-semibold">
        <span>Rückgeld</span>
        <span class="text-green-600">{formatCurrency(change)}</span>
      </div>
    {/if}

    <div class="flex gap-2 pt-2">
      <Button variant="secondary" class="flex-1" onclick={() => showCheckout = false}>Abbrechen</Button>
      <Button variant="success" class="flex-1" onclick={checkout} disabled={paymentMethod === 'cash' && change < 0}>Abschließen</Button>
    </div>
  </div>
</Modal>