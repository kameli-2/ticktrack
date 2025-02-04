const LOCALSTORAGE_ITEM_KEY = 'settings';

export type Settings = {
  rounding__round_to: number,
  rounding__always_round_up: boolean,
  rounding__min_duration: number,
  rounding__max_decimals: number,
}

const DEFAULT_SETTINGS: Settings = {
  rounding__round_to: 30,
  rounding__always_round_up: true,
  rounding__min_duration: 30,
  rounding__max_decimals: 2,
}

export function saveSettings(settings: Partial<Settings>) {
  const currentSettings = getSettings();
  const newSettings: Settings = {
    ...currentSettings,
    ...settings,
  };

  window.localStorage.setItem(LOCALSTORAGE_ITEM_KEY, JSON.stringify(newSettings));
}

export function getSettings(id?: keyof Settings) {
  const userSettings = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_ITEM_KEY) || '{}');
  const allSettings = {
    ...DEFAULT_SETTINGS,
    ...userSettings,
  };

  if (!id) return allSettings;

  return allSettings[id];
}