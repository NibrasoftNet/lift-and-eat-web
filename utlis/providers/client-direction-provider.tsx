'use client';

import { DirectionProvider } from '@radix-ui/react-direction';
import React from 'react';
import { ThemeDirectionType } from '@/utlis/types/settings.type';

export function ClientDirectionProvider({ dir, children }: {
  dir: ThemeDirectionType;
  children: React.ReactNode;
}) {
  return <DirectionProvider dir={dir}>{children}</DirectionProvider>;
}
