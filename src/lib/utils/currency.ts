export function formatCurrency(
  amount: number,
  currency = 'EUR',
  locale = 'de-DE'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatNumber(
  amount: number,
  locale = 'de-DE',
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  }).format(amount);
}

export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^\d.,-]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function roundToCents(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function calculateTax(amount: number, taxRate: number): number {
  return roundToCents(amount * (taxRate / 100));
}

export function calculateDiscount(amount: number, discountPercent: number): number {
  return roundToCents(amount * (discountPercent / 100));
}