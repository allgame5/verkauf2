<script>
  let { variant = 'primary', size = 'md', disabled = false, type = 'button', class: cls = '', ...rest } = $props();

  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400 border border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:border-gray-600',
    success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 focus-visible:ring-gray-400 dark:hover:bg-gray-800'
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
</script>

<button class="{base} {variants[variant]} {sizes[size]} {cls}" type={type} disabled={disabled} {...rest}>
  <slot />
</button>