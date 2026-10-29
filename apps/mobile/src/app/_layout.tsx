import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import AppTabs from '@/components/app-tabs';
import { CityPickerContent } from '@/components/city-picker';
import { Screen } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { CityProvider, useCity } from '@/hooks/use-city';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DirectoryProvider } from '@/hooks/use-directory';

/** Поки місто не вибране — показуємо екран «Звідки ви?» замість вкладок */
function Main({ background }: { background: string }) {
  const { loading, city } = useCity();
  if (loading) return <View style={{ flex: 1, backgroundColor: background }} />;
  if (!city) {
    return (
      <Screen>
        <CityPickerContent />
      </Screen>
    );
  }
  return <AppTabs />;
}

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
      <CityProvider>
        <DirectoryProvider>
          <StatusBar style="auto" />
          <Main background={c.background} />
        </DirectoryProvider>
      </CityProvider>
    </ThemeProvider>
  );
}
