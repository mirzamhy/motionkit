import { useState } from 'react';

export const EDITORIAL_FONTS = {
  disp: 'serif',
  ui: 'serif',
  mono: 'monospace',
} as const;

export const useEditorialFonts = () => {
  return EDITORIAL_FONTS;
};
