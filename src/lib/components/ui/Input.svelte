<script>
  let { label, type = 'text', placeholder = '', value = $bindable(), error, class: cls = '', ...rest } = $props();
  const id = crypto.randomUUID();
</script>

<div class="w-full">
  {#if label}
    <label for={id} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
  {/if}
  <input
    id={id}
    type={type}
    placeholder={placeholder}
    bind:value
    class="w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:bg-gray-100 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-500 {error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-gray-600'} {cls}"
    {...rest}
  />
  {#if error}
    <p class="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
  {/if}
</div>