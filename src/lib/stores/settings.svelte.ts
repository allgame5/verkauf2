const browser = typeof window !== 'undefined';

interface Settings {
  currency: string;
  taxRate: number;
  receiptHeader: string;
  receiptFooter: string;
  darkMode: boolean;
}

const DEFAULT: Settings = {
  currency: 'EUR',
  taxRate: 19,
  receiptHeader: 'Loes POS\nMusterstraße 1\n12345 Musterstadt',
  receiptFooter: 'Vielen Dank für Ihren Einkauf!',
  darkMode: false
};

function load(): Settings {
  if (!browser) return DEFAULT;
  try {
    const data = localStorage.getItem('pos_settings');
    return data ? { ...DEFAULT, ...JSON.parse(data) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function save(s: Settings) {
  if (!browser) return;
  localStorage.setItem('pos_settings', JSON.stringify(s));
}

const settings = $state<Settings>(load());

export const settingsStore = {
  get all() { return settings; },
  get currency() { return settings.currency; },
  get taxRate() { return settings.taxRate; },
  get darkMode() { return settings.darkMode; },
  toggleDark() {
    settings.darkMode = !settings.darkMode;
    save(settings);
    if (browser) document.documentElement.classList.toggle('dark', settings.darkMode);
  },
  initDark() {
    if (browser) document.documentElement.classList.toggle('dark', settings.darkMode);
  },
  update(partial: Partial<Settings>) {
    Object.assign(settings, partial);
    save(settings);
    if (partial.darkMode !== undefined && browser) {
      document.documentElement.classList.toggle('dark', settings.darkMode);
    }
  }
};