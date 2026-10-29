import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import AppTabs from '@/components/app-tabs';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const c = Colors[scheme];

  // Підставляємо наші кольори в тему навігації, щоб між екранами не блимав білий фон.
  const theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: c.accent,
      background: c.background,
      card: c.backgroundElement,
      text: c.text,
      border: c.border,
    },
  };

  return (
    <ThemeProvider value={theme}>
      <StatusBar style="auto" />
      <AppTabs />
    </ThemeProvider>
  );
}
