// Дрібні спільні елементи інтерфейсу: пошук, чіпси, заголовки секцій, аватар, бейдж.

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Фон екрана + відступ від «чубчика» телефону зверху */
export function Screen({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={['top']} style={[styles.screen, { backgroundColor: theme.background }]}>
      {children}
    </SafeAreaView>
  );
}

export function SearchBar({
  value,
  onChangeText,
  placeholder,
  style,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  style?: ViewStyle;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.search,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        style,
      ]}>
      <Icon name="search" size={18} color={theme.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        returnKeyType="search"
        clearButtonMode="while-editing"
        style={[styles.searchInput, { color: theme.text }]}
      />
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active
          ? { backgroundColor: theme.text, borderColor: theme.text }
          : { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <ThemedText type="smallBold" style={{ color: active ? theme.background : theme.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} style={({ pressed }) => pressed && styles.pressed}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            {actionLabel}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Замість лого — ініціали на кольоровому фоні (як у Gmail) */
export function Avatar({ name, tint, size = 52 }: { name: string; tint: string; size?: number }) {
  const scheme = useColorScheme();
  const initials = name
    .replace(/[«»"']/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  const dark = scheme === 'dark';
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size * 0.32,
          backgroundColor: dark ? `${tint}33` : tint,
        },
      ]}>
      <ThemedText
        style={{ fontSize: size * 0.36, fontWeight: 800, color: dark ? tint : '#14172B' }}>
        {initials}
      </ThemedText>
    </View>
  );
}

export function Badge({ label, tone = 'highlight' }: { label: string; tone?: 'highlight' | 'accent' }) {
  const theme = useTheme();
  const bg = tone === 'highlight' ? theme.highlight : theme.accentSoft;
  const fg = tone === 'highlight' ? theme.highlightText : theme.accent;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <ThemedText style={[styles.badgeText, { color: fg }]}>{label}</ThemedText>
    </View>
  );
}

/** «Завантажуємо…» або «Не вдалося завантажити» з кнопкою «Спробувати ще» */
export function DataStatus({
  loading,
  error,
  onRetry,
}: {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const theme = useTheme();
  if (error) {
    return (
      <View style={styles.status}>
        <ThemedText style={styles.statusEmoji}>📡</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.statusText}>
          Не вдалося завантажити дані. Перевірте інтернет.
        </ThemedText>
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [
            styles.retry,
            { backgroundColor: theme.accent },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="smallBold" style={{ color: theme.accentText }}>
            Спробувати ще
          </ThemedText>
        </Pressable>
      </View>
    );
  }
  if (loading) {
    return (
      <View style={styles.status}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }
  return null;
}

export const styles = StyleSheet.create({
  status: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.five,
  },
  statusEmoji: {
    fontSize: 40,
    lineHeight: 48,
  },
  statusText: {
    textAlign: 'center',
  },
  retry: {
    borderRadius: Radius.pill,
    paddingVertical: Spacing.two + Spacing.one,
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.two,
  },
  screen: {
    flex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  chip: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 700,
    letterSpacing: -0.3,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: 800,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
