import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BusinessCard } from '@/components/business-card';
import { CityPicker } from '@/components/city-picker';
import { EventFeatureCard, EventRow } from '@/components/event-card';
import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Avatar, Badge, DataStatus, SearchBar, SectionHeader } from '@/components/ui';
import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { useCity } from '@/hooks/use-city';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDirectory } from '@/hooks/use-directory';
import { useTheme } from '@/hooks/use-theme';
import { isWithinDays } from '@/lib/dates';

export default function HomeScreen() {
  const theme = useTheme();
  const scheme = useColorScheme();
  const [query, setQuery] = useState('');
  const { city } = useCity();
  const [pickerOpen, setPickerOpen] = useState(false);
  const { categories, businesses, events, loading, error, reload } = useDirectory();

  const q = query.trim().toLowerCase();
  // Івенти з бази вже відсортовані за датою.
  const weekEvents = useMemo(() => events.filter((e) => isWithinDays(e.startsAt, 7)), [events]);
  const featured = businesses.find((b) => b.featured);
  const newest = businesses.filter((b) => b.isNew);

  const found = useMemo(() => {
    if (!q) return null;
    return {
      businesses: businesses.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.locality.toLowerCase().includes(q),
      ),
      events: events.filter(
        (e) => e.title.toLowerCase().includes(q) || e.place.toLowerCase().includes(q),
      ),
    };
  }, [q, businesses, events]);

  // Поки немає жодних даних — показуємо завантаження або помилку замість секцій.
  const noData = categories.length === 0;

  return (
    <View style={[styles.flex, { backgroundColor: theme.background }]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.five }}>
        {/* Синя «шапка» з привітанням і пошуком */}
        <View style={[styles.hero, { experimental_backgroundImage: theme.heroGradient }]}>
          <SafeAreaView edges={['top']} style={styles.heroInner}>
            <Pressable
              onPress={() => setPickerOpen(true)}
              hitSlop={10}
              accessibilityLabel="Змінити місто"
              style={({ pressed }) => [styles.cityButton, pressed && { opacity: 0.6 }]}>
              <ThemedText style={styles.heroKicker}>🇺🇦 {city?.name ?? 'Місто'}</ThemedText>
              <Icon name="chevronDown" size={12} color="#FFC83D" />
            </Pressable>
            <ThemedText style={styles.heroTitle}>Привіт! Що шукаємо сьогодні?</ThemedText>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Заклади, послуги, івенти…"
              style={styles.heroSearch}
            />
          </SafeAreaView>
        </View>

        {noData || error ? (
          <DataStatus loading={loading} error={error} onRetry={reload} />
        ) : found ? (
          <View style={styles.sections}>
            <SectionHeader title={`Бізнеси · ${found.businesses.length}`} />
            {found.businesses.map((b) => (
              <BusinessCard key={b.id} item={b} />
            ))}
            <SectionHeader title={`Івенти · ${found.events.length}`} />
            {found.events.map((e) => (
              <EventRow key={e.id} item={e} />
            ))}
            {found.businesses.length + found.events.length === 0 ? (
              <ThemedText themeColor="textSecondary" style={styles.empty}>
                Нічого не знайшли. Спробуйте інше слово.
              </ThemedText>
            ) : null}
          </View>
        ) : (
          <View style={styles.sections}>
            {/* Цього тижня */}
            {weekEvents.length > 0 ? (
              <View style={styles.block}>
                <SectionHeader
                  title="Цього тижня"
                  actionLabel="Усі →"
                  onAction={() => router.navigate('/events')}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.carousel}>
                  {weekEvents.map((e, i) => (
                    <EventFeatureCard key={e.id} item={e} index={i} />
                  ))}
                </ScrollView>
              </View>
            ) : null}

            {/* Категорії */}
            <View style={styles.block}>
              <SectionHeader
                title="Категорії"
                actionLabel="Каталог →"
                onAction={() => router.navigate('/catalog')}
              />
              <View style={styles.grid}>
                {categories.map((c) => (
                  <Pressable
                    key={c.id}
                    onPress={() =>
                      router.navigate({ pathname: '/catalog', params: { category: c.id } })
                    }
                    style={({ pressed }) => [
                      styles.tile,
                      {
                        backgroundColor: scheme === 'dark' ? theme.backgroundElement : c.tint,
                      },
                      pressed && styles.pressed,
                    ]}>
                    <ThemedText style={styles.tileEmoji}>{c.emoji}</ThemedText>
                    <ThemedText numberOfLines={2} style={styles.tileLabel}>
                      {c.name}
                    </ThemedText>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Рекомендуємо — у майбутньому платне місце */}
            {featured ? (
              <View style={styles.block}>
                <SectionHeader title="Рекомендуємо" />
                <View
                  style={[
                    styles.featured,
                    { backgroundColor: theme.highlightSoft, borderColor: theme.highlight },
                  ]}>
                  <Avatar
                    name={featured.name}
                    tint={categories.find((c) => c.id === featured.categoryId)?.tint ?? '#FFE7C2'}
                    size={60}
                  />
                  <View style={styles.flex}>
                    <Badge label="★ Вибір тижня" />
                    <ThemedText style={styles.featuredTitle}>{featured.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {featured.description}
                    </ThemedText>
                  </View>
                </View>
              </View>
            ) : null}

            {/* Нове в каталозі */}
            {newest.length > 0 ? (
              <View style={styles.block}>
                <SectionHeader title="Нове в каталозі" />
                {newest.map((b) => (
                  <BusinessCard key={b.id} item={b} />
                ))}
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
      <CityPicker visible={pickerOpen} onClose={() => setPickerOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.97 }] },
  hero: {
    borderBottomLeftRadius: Radius.lg + 6,
    borderBottomRightRadius: Radius.lg + 6,
  },
  heroInner: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.two,
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.one,
  },
  heroKicker: {
    color: '#FFC83D',
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 800,
    letterSpacing: -0.5,
    marginBottom: Spacing.two,
  },
  heroSearch: {
    borderWidth: 0,
  },
  sections: {
    gap: Spacing.three,
    paddingTop: Spacing.four,
  },
  block: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  carousel: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.three,
    gap: Spacing.two + Spacing.one,
  },
  tile: {
    width: '22.6%',
    flexGrow: 1,
    aspectRatio: 0.95,
    borderRadius: Radius.md,
    padding: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  tileEmoji: {
    fontSize: 28,
    lineHeight: 34,
  },
  tileLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: 700,
    textAlign: 'center',
  },
  featured: {
    marginHorizontal: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
  },
  featuredTitle: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: 800,
    marginTop: Spacing.one,
  },
  empty: {
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
  },
});
