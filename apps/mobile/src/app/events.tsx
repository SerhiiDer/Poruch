import { useMemo, useState } from 'react';
import { ScrollView, SectionList, StyleSheet, View } from 'react-native';

import { EventRow } from '@/components/event-card';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Chip, Screen } from '@/components/ui';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { events, type EventItem } from '@/data/mock';
import { dayGroupLabel, isThisWeekend, isToday } from '@/lib/dates';

type Filter = 'all' | 'today' | 'weekend' | 'free' | 'kids' | 'music';

const filters: { id: Filter; label: string; test: (e: EventItem) => boolean }[] = [
  { id: 'all', label: 'Усі', test: () => true },
  { id: 'today', label: 'Сьогодні', test: (e) => isToday(e.startsAt) },
  { id: 'weekend', label: 'Вихідні', test: (e) => isThisWeekend(e.startsAt) },
  { id: 'free', label: 'Безкоштовно', test: (e) => e.tags.includes('free') },
  { id: 'kids', label: 'Для дітей', test: (e) => e.tags.includes('kids') },
  { id: 'music', label: 'Музика', test: (e) => e.tags.includes('music') },
];

export default function EventsScreen() {
  const [filter, setFilter] = useState<Filter>('all');

  // Групуємо івенти по днях: «Сьогодні», «Завтра», «сб, 1 листопада»…
  const sections = useMemo(() => {
    const test = filters.find((f) => f.id === filter)!.test;
    const sorted = events.filter(test).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    const groups = new Map<string, EventItem[]>();
    for (const e of sorted) {
      const key = dayGroupLabel(e.startsAt);
      groups.set(key, [...(groups.get(key) ?? []), e]);
    }
    return [...groups.entries()].map(([title, data]) => ({ title, data }));
  }, [filter]);

  return (
    <Screen>
      <SectionList
        sections={sections}
        keyExtractor={(e) => e.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => <EventRow item={item} />}
        renderSectionHeader={({ section }) => (
          <ThemedText themeColor="textSecondary" style={styles.dayLabel}>
            {section.title}
          </ThemedText>
        )}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.two + Spacing.one }} />}
        ListHeaderComponent={
          <View>
            <ScreenHeader title="Івенти" subtitle="Що відбувається в українському Чикаго" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}>
              {filters.map((f) => (
                <Chip
                  key={f.id}
                  label={f.label}
                  active={filter === f.id}
                  onPress={() => setFilter(f.id)}
                />
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText style={styles.emptyEmoji}>🗓️</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.emptyText}>
              Поки що нічого. Загляньте пізніше або змініть фільтр.
            </ThemedText>
          </View>
        }
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.five }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  dayLabel: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.six,
    paddingHorizontal: Spacing.five,
  },
  emptyEmoji: {
    fontSize: 44,
    lineHeight: 52,
  },
  emptyText: {
    textAlign: 'center',
  },
});
