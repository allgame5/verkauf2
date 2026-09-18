<script>
  let { open = $bindable(false), title, children, class: cls = '' } = $props();
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
    <div class="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl animate-scale-in dark:bg-gray-900 {cls}">
      {#if title}
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onclick={() => open = false} class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      {/if}
      {@render children()}
    </div>
  </div>
{/if}

<style>
  @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
  @keyframes scale-in { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
  .animate-fade-in { animation: fade-in 0.2s ease-out }
  .animate-scale-in { animation: scale-in 0.2s ease-out }
</style>