'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';
import { useSettingsStore } from '@/utlis/stores/settingsStore';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const { themeSetting } = useSettingsStore()

  return <NextThemesProvider defaultTheme={themeSetting} {...props}>{children}</NextThemesProvider>;
}
