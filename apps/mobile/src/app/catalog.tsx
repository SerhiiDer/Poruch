import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { BusinessCard } from '@/components/business-card';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Chip, Screen, SearchBar } from '@/components/ui';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { businesses, categories } from '@/data/mock';

export default function CatalogScreen() {
  // Категорію можна передати з головної: /catalog?category=food
  const params = useLocalSearchParams<{ category?: string }>();
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(params.category ?? null);

  // Якщо з головної прийшла нова категорія — вмикаємо її (без useEffect, як радить React).
  const [lastParam, setLastParam] = useState(params.category);
  if (params.category !== lastParam) {
    setLastParam(params.category);
    if (params.category) setCategoryId(params.category);
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return businesses.filter(
      (b) =>
        (categoryId === null || b.categoryId === categoryId) &&
        (q === '' ||
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q)),
    );
  }, [query, categoryId]);

  return (
    <Screen>
      <FlatList
        data={results}
        keyExtractor={(b) => b.id}
        renderItem={({ item }) => <BusinessCard item={item} />}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={{ height: Spacing.two + Spacing.one }} />}
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.five }}
        ListHeaderComponent={
          <View style={styles.header}>
            <ScreenHeader title="Каталог" subtitle="Українські бізнеси Чикаго і передмість" />
            <SearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="Назва, послуга або місто"
              style={styles.search}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chips}>
              <Chip label="Усі" active={categoryId === null} onPress={() => setCategoryId(null)} />
              {categories.map((c) => (
                <Chip
                  key={c.id}
                  label={`${c.emoji} ${c.name}`}
                  active={categoryId === c.id}
                  onPress={() => setCategoryId(categoryId === c.id ? null : c.id)}
                />
              ))}
            </ScrollView>
            <ThemedText type="small" themeColor="textSecondary" style={styles.count}>
              Знайдено: {results.length}
            </ThemedText>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText style={styles.emptyEmoji}>🔎</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.emptyText}>
              Нічого не знайшли. Знаєте український бізнес, якого тут немає? Додайте його у вкладці «Я».
            </ThemedText>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.three,
    paddingBottom: Spacing.three,
  },
  search: {
    marginHorizontal: Spacing.three,
  },
  chips: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  count: {
    paddingHorizontal: Spacing.three,
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.five,
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
