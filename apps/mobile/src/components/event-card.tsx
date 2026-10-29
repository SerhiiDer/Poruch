import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { eventTagLabels, type EventItem } from '@/data/types';
import { dateParts, formatTime } from '@/lib/dates';
import { useTheme } from '@/hooks/use-theme';

// Кольори «обкладинок» великих карток — по черзі, щоб карусель виглядала живою.
const covers = [
  'linear-gradient(140deg, #1F4FD1 0%, #4C86FF 100%)',
  'linear-gradient(140deg, #F2A007 0%, #FFD45C 100%)',
  'linear-gradient(140deg, #0E8F6E 0%, #3CCB9F 100%)',
  'linear-gradient(140deg, #C23B6B 0%, #F07AA0 100%)',
  'linear-gradient(140deg, #6A3FD1 0%, #9C7BFF 100%)',
];

function DateStamp({ iso, inverted }: { iso: string; inverted?: boolean }) {
  const theme = useTheme();
  const { day, month } = dateParts(iso);
  return (
    <View
      style={[
        styles.stamp,
        { backgroundColor: inverted ? 'rgba(255,255,255,0.92)' : theme.accentSoft },
      ]}>
      <ThemedText style={[styles.stampDay, { color: inverted ? '#14172B' : theme.accent }]}>
        {day}
      </ThemedText>
      <ThemedText style={[styles.stampMonth, { color: inverted ? '#14172B' : theme.accent }]}>
        {month}
      </ThemedText>
    </View>
  );
}

/** Велика картка для каруселі «Цього тижня» на головній */
export function EventFeatureCard({ item, index }: { item: EventItem; index: number }) {
  const theme = useTheme();
  return (
    <Pressable style={({ pressed }) => [styles.feature, pressed && styles.pressed]}>
      <View
        style={[styles.cover, { experimental_backgroundImage: covers[index % covers.length] }]}>
        <DateStamp iso={item.startsAt} inverted />
        {item.tags.includes('free') ? <Badge label="Безкоштовно" /> : null}
      </View>
      <View style={[styles.featureBody, { backgroundColor: theme.backgroundElement }]}>
        <ThemedText numberOfLines={2} style={styles.featureTitle}>
          {item.title}
        </ThemedText>
        <View style={styles.metaRow}>
          <Icon name="pin" size={13} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1} style={styles.flex}>
            {item.place}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

/** Рядок у списку на вкладці «Івенти» */
export function EventRow({ item }: { item: EventItem }) {
  const theme = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <DateStamp iso={item.startsAt} />
      <View style={styles.rowBody}>
        <ThemedText numberOfLines={2} style={styles.rowTitle}>
          {item.title}
        </ThemedText>
        <View style={styles.metaRow}>
          <Icon name="pin" size={13} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1} style={styles.flex}>
            {formatTime(item.startsAt)} · {item.place}
          </ThemedText>
        </View>
        <View style={styles.tags}>
          {item.price ? (
            <View style={[styles.tag, { backgroundColor: theme.highlightSoft }]}>
              <ThemedText style={[styles.tagText, { color: theme.text }]}>🎟️ {item.price}</ThemedText>
            </View>
          ) : null}
          {item.tags
            .filter((t) => t !== 'free')
            .map((t) => (
              <View key={t} style={[styles.tag, { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText style={[styles.tagText, { color: theme.textSecondary }]}>
                  {eventTagLabels[t]}
                </ThemedText>
              </View>
            ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  stamp: {
    width: 52,
    height: 56,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampDay: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: 800,
  },
  stampMonth: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  feature: {
    width: 250,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  cover: {
    height: 120,
    padding: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featureBody: {
    padding: Spacing.three,
    gap: Spacing.one,
    minHeight: 92,
  },
  featureTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 700,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    marginHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  rowBody: {
    flex: 1,
    gap: Spacing.one,
  },
  rowTitle: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 700,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  tag: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  tagText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 600,
  },
});
