import type { LocalePrefixMode } from 'next-intl/routing';

const localePrefix: LocalePrefixMode = 'always';

// FIXME: Update this configuration file based on your project information
export const AppConfig = {
  name: 'Lift & Eat',
  locales: ['en', 'fr', 'ar'],
  defaultLocale: 'en',
  localePrefix,
};
