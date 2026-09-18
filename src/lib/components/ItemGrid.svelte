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
  let showNewCategoryInput = $state(false);
  let newCategoryName = $state('');

  const formatCurrency = (amount) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  const currentItems = $derived(itemsStore.byCategory[activeCategory] || []);

  function handleCategoryChange(value) {
    if (value === '__NEW__') {
      showNewCategoryInput = true;
      newCategory = '';
    } else {
      showNewCategoryInput = false;
      newCategory = value;
    }
  }

  function addItem() {
    if (!newName.trim() || !newPrice) return;
    
    let finalCategory = newCategory;
    if (showNewCategoryInput && newCategoryName.trim()) {
      finalCategory = newCategoryName.trim();
      // Kategorie wird automatisch durch den ersten Artikel erstellt
    } else if (!finalCategory && itemsStore.categories.length > 0) {
      finalCategory = itemsStore.categories[0];
    }
    
    itemsStore.add({ name: newName.trim(), price: parseFloat(newPrice), category: finalCategory });
    activeCategory = finalCategory;
    newName = '';
    newPrice = '';
    newCategoryName = '';
    showNewCategoryInput = false;
    newCategory = itemsStore.categories[0] || '';
    showAddForm = false;
  }

  function deleteItem(id) {
    if (confirm('Artikel löschen?')) itemsStore.remove(id);
  }
</script>

<div class="flex-1 overflow-auto p-3 sm:p-4">
  <div class="flex flex-wrap gap-2 mb-3 sm:mb-4" role="tablist" aria-label="Kategorien">
    {#each itemsStore.categories as cat}
      <Button
        variant={activeCategory === cat ? 'primary' : 'secondary'}
        size="sm"
        onclick={() => activeCategory = cat}
        role="tab"
        aria-selected={activeCategory === cat}
      >{cat}</Button>
    {/each}
    <Button variant="ghost" size="sm" onclick={() => { showAddForm = true; showNewCategoryInput = false; }} aria-label="Artikel hinzufügen">+ Artikel</Button>
  </div>

  {#if showAddForm}
    <div class="card p-3 sm:p-4 mb-4 animate-slide-in">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-medium">Neuen Artikel</h3>
        <Button variant="ghost" size="sm" onclick={() => { showAddForm = false; showNewCategoryInput = false; }}>✕</Button>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <Input label="Name" bind:value={newName} placeholder="Artikelname" autofocus />
        <Input label="Preis" type="number" step="0.01" bind:value={newPrice} placeholder="0.00" inputmode="decimal" />
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kategorie</label>
          {#if showNewCategoryInput}
            <Input bind:value={newCategoryName} placeholder="Neue Kategorie" />
          {:else}
            <select bind:value={newCategory} onchange={(e) => handleCategoryChange(e.target.value)} class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100">
              {#each itemsStore.categories as cat}<option value={cat}>{cat}</option>{/each}
              <option value="__NEW__">+ Neue Kategorie erstellen…</option>
            </select>
          {/if}
        </div>
      </div>
      <div class="flex gap-2 mt-3 justify-end">
        <Button variant="ghost" onclick={() => { showAddForm = false; showNewCategoryInput = false; }}>Abbrechen</Button>
        <Button onclick={addItem} disabled={!newName.trim() || !newPrice}>Hinzufügen</Button>
      </div>
    </div>
  {/if}

  <div class="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    {#each currentItems as item}
      <Button
        variant="secondary"
        class="h-20 sm:h-24 flex-col gap-1 text-left p-3 sm:p-4 hover:shadow-md active:scale-[0.98] transition-transform"
        onclick={() => cartStore.add(item)}
      >
        <span class="font-medium truncate">{item.name}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(item.price)}</span>
        <Button variant="ghost" size="sm" class="mt-1" onclick={(e) => { e.stopPropagation(); deleteItem(item.id); }} aria-label={item.name + ' löschen'}>
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </Button>
      </Button>
    {/each}
  </div>

  {#if !currentItems.length}
    <div class="text-center py-12 text-gray-500 dark:text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
      <p>Keine Artikel in dieser Kategorie</p>
      <Button variant="ghost" class="mt-2" onclick={() => showAddForm = true}>Ersten Artikel anlegen</Button>
    </div>
  {/if}
</div>

<style>
  @keyframes slide-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  .animate-slide-in { animation: slide-in 0.2s ease-out; }
</style>