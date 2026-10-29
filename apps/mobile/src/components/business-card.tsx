import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Avatar, Badge } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { categories, type Business } from '@/data/mock';
import { useTheme } from '@/hooks/use-theme';

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
  const category = categories.find((c) => c.id === item.categoryId);

  // Поки що відкриваємо посилання напряму. На кроці 3 тут з'явиться підрахунок кліків.
  const openMaps = () =>
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name} ${item.address}`)}`,
    );

  return (
    <View
      style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
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
            {category ? `${category.emoji} ${category.name}` : ''} · {item.city}
          </ThemedText>
        </View>
      </View>
      <View style={styles.actions}>
        {item.phone ? (
          <ActionButton
            icon="call"
            label="Подзвонити"
            primary
            onPress={() => Linking.openURL(`tel:${item.phone}`)}
          />
        ) : null}
        <ActionButton icon="directions" label="Маршрут" onPress={openMaps} />
        {item.instagram ? (
          <ActionButton
            icon="instagram"
            label="Instagram"
            onPress={() => Linking.openURL(`https://instagram.com/${item.instagram}`)}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.7 },
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
