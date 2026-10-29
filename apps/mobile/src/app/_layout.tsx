import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { CityPickerContent } from '@/components/city-picker';
import { Screen } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { CityProvider, useCity } from '@/hooks/use-city';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DirectoryProvider } from '@/hooks/use-directory';

/**
 * Поки місто не вибране — показуємо екран «Звідки ви?».
 * Далі — стек: вкладки знизу, а сторінка закладу відкривається поверх них.
 */
function Main({ colors }: { colors: (typeof Colors)['light' | 'dark'] }) {
  const { loading, city } = useCity();
  if (loading) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  if (!city) {
    return (
      <Screen>
        <CityPickerContent />
      </Screen>
    );
  }
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.accent,
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="business/[id]" options={{ title: '' }} />
    </Stack>
  );
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
          <Main colors={c} />
        </DirectoryProvider>
      </CityProvider>
    </ThemeProvider>
  );
}
