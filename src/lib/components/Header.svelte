<script>
  import Button from './ui/Button.svelte';
  import { settingsStore } from '../stores/settings.svelte';
  import { cartStore } from '../stores/cart.svelte';

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  }
</script>

<header class="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80">
  <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Loes POS</h1>
  <div class="flex items-center gap-2">
    <span class="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
      Warenkorb: {cartStore.count} &middot; {formatCurrency(cartStore.total)}
    </span>
    <Button variant="ghost" size="sm" onclick={() => settingsStore.toggleDark()} aria-label="Dark mode toggle">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {#if settingsStore.darkMode}
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
        {:else}
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        {/if}
      </svg>
    </Button>
  </div>
</header>