// stores/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LanguageType, ThemeType } from '../types/settings.type';



type SettingsState = {
  themeSetting: ThemeType;
  languageSetting: LanguageType;
  setThemeSetting: (theme: ThemeType) => void;
  setLanguageSetting: (language: LanguageType) => void;
};

export const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      themeSetting: 'system',
      languageSetting: 'en',
      setThemeSetting: (themeSetting) => set({ themeSetting }),
      setLanguageSetting: (languageSetting) => set({ languageSetting }),
    }),
    {
      name: 'settings-storage', // localStorage key
    }
  )
);