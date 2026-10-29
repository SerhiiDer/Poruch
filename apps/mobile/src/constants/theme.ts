/**
 * Кольори застосунку для світлої і темної теми.
 * Основа: сапфірово-синій + соняшниково-жовтий на теплому світлому фоні.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#14172B',
    textSecondary: '#6B6F80',
    background: '#F6F4EF',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#ECE8DF',
    border: '#E7E2D8',
    accent: '#1F4FD1',
    accentSoft: '#E3EAFF',
    accentText: '#FFFFFF',
    highlight: '#FFC83D',
    highlightSoft: '#FFF4D6',
    highlightText: '#3A2A00',
    heroGradient: 'linear-gradient(135deg, #1F4FD1 0%, #3C7BFF 100%)',
  },
  dark: {
    text: '#F2F3F7',
    textSecondary: '#9A9FB2',
    background: '#0D1020',
    backgroundElement: '#171B2E',
    backgroundSelected: '#22273D',
    border: '#262B42',
    accent: '#7FA2FF',
    accentSoft: '#1E2A52',
    accentText: '#0D1020',
    highlight: '#FFC83D',
    highlightSoft: '#3A3016',
    highlightText: '#2A1E00',
    heroGradient: 'linear-gradient(135deg, #1A3BA8 0%, #2F5FE0 100%)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
