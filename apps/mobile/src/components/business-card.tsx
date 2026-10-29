import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Avatar, Badge } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import type { Business } from '@/data/types';
import { useDirectory } from '@/hooks/use-directory';
import { useTheme } from '@/hooks/use-theme';
import { callBusiness, openInstagram, openMaps } from '@/lib/links';

function ActionButton({
  icon,
  label,
  primary,
  onPress,
}: {
  icon: IconName;
  label: string;
  primary?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const fg = primary ? theme.accentText : theme.accent;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: primary ? theme.accent : theme.accentSoft },
        pressed && styles.pressed,
      ]}>
      <Icon name={icon} size={14} color={fg} />
      <ThemedText type="smallBold" style={{ color: fg }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function BusinessCard({ item }: { item: Business }) {
  const theme = useTheme();
  const { categories } = useDirectory();
  const category = categories.find((c) => c.id === item.categoryId);

  // Натиск на картку відкриває сторінку закладу. Кнопки всередині працюють окремо.
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/business/[id]', params: { id: item.id } })}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.cardPressed,
      ]}>
      <View style={styles.top}>
        <Avatar name={item.name} tint={category?.tint ?? '#E4E7EC'} />
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <ThemedText numberOfLines={1} style={styles.title}>
              {item.name}
            </ThemedText>
            {item.isNew ? <Badge label="Нове" tone="accent" /> : null}
          </View>
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
            {item.description}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {[category && `${category.emoji} ${category.name}`, item.locality]
              .filter(Boolean)
              .join(' · ')}
          </ThemedText>
        </View>
      </View>
      <View style={styles.actions}>
        {item.phone ? (
          <ActionButton
            icon="call"
            label="Подзвонити"
            primary
            onPress={() => callBusiness(item)}
          />
        ) : null}
        <ActionButton icon="directions" label="Маршрут" onPress={() => openMaps(item)} />
        {item.instagram ? (
          <ActionButton icon="instagram" label="Instagram" onPress={() => openInstagram(item)} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.7 },
  cardPressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  card: {
    marginHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  top: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  info: {
    flex: 1,
    gap: Spacing.half,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + Spacing.half,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
});
