<script>
  import Header from './lib/components/Header.svelte';
  import ItemGrid from './lib/components/ItemGrid.svelte';
  import Cart from './lib/components/Cart.svelte';
  import Toast from './lib/components/ui/Toast.svelte';
  import { settingsStore } from './lib/stores/settings.svelte';

  let toasts = $state([]);

  function showToast(type, message) {
    const id = crypto.randomUUID();
    toasts.push({ id, type, message });
    setTimeout(() => { toasts = toasts.filter(t => t.id !== id); }, 3000);
  }

  settingsStore.initDark();
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
  <Header />

  <main class="flex-1 flex flex-col lg:flex-row overflow-hidden">
    <section class="flex-1 lg:overflow-auto">
      <ItemGrid />
    </section>
    <Cart />
  </main>

  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    {#each toasts as toast}
      <Toast type={toast.type} message={toast.message} onClose={() => toasts = toasts.filter(t => t.id !== toast.id)} />
    {/each}
  </div>
</div>