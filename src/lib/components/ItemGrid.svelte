<script>
  import Button from './ui/Button.svelte';
  import Input from './ui/Input.svelte';
  import { itemsStore } from '../stores/items.svelte';
  import { cartStore } from '../stores/cart.svelte';

  let activeCategory = $state(itemsStore.categories[0] || '');
  let showAddForm = $state(false);
  let newName = $state('');
  let newPrice = $state('');
  let newCategory = $state(itemsStore.categories[0] || '');

  const formatCurrency = (amount) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);

  function addItem() {
    if (!newName.trim() || !newPrice) return;
    itemsStore.add({ name: newName.trim(), price: parseFloat(newPrice), category: newCategory });
    newName = '';
    newPrice = '';
    showAddForm = false;
  }

  function deleteItem(id) {
    if (confirm('Artikel löschen?')) itemsStore.remove(id);
  }
</script>

<div class="flex-1 overflow-auto p-4">
  <div class="flex flex-wrap gap-2 mb-4">
    {#each itemsStore.categories as cat}
      <Button variant={activeCategory === cat ? 'primary' : 'secondary'} size="sm" onclick={() => activeCategory = cat}>{cat}</Button>
    {/each}
    <Button variant="ghost" size="sm" onclick={() => showAddForm = true}>+ Artikel</Button>
  </div>

  {#if showAddForm}
    <div class="card p-4 mb-4">
      <h3 class="font-medium mb-3">Neuen Artikel</h3>
      <div class="grid gap-3 sm:grid-cols-3">
        <Input label="Name" bind:value={newName} placeholder="Artikelname" />
        <Input label="Preis" type="number" step="0.01" bind:value={newPrice} placeholder="0.00" />
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kategorie</label>
          <select bind:value={newCategory} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100">
            {#each itemsStore.categories as cat}<option value={cat}>{cat}</option>{/each}
            <option value="Neu">+ Neue Kategorie</option>
          </select>
        </div>
      </div>
      <div class="flex gap-2 mt-3"><Button onclick={addItem}>Hinzufügen</Button><Button variant="ghost" onclick={() => showAddForm = false}>Abbrechen</Button></div>
    </div>
  {/if}

  <div class="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    {#each itemsStore.byCategory[activeCategory] || [] as item}
      <Button variant="secondary" class="h-24 flex-col gap-1 text-left p-3 hover:shadow-md" onclick={() => cartStore.add(item)}>
        <span class="font-medium truncate">{item.name}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(item.price)}</span>
        <Button variant="ghost" size="sm" class="mt-1" onclick={(e) => { e.stopPropagation(); deleteItem(item.id); }}>
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </Button>
      </Button>
    {/each}
  </div>

  {#if !(itemsStore.byCategory[activeCategory]?.length)}
    <div class="text-center py-12 text-gray-500 dark:text-gray-400">Keine Artikel in dieser Kategorie</div>
  {/if}
</div>