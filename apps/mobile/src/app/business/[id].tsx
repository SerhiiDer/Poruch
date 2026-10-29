// Сторінка закладу: опис, години, адреса, контакти.

import { Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/icon';
import { ListGroup, ListRow } from '@/components/list-group';
import { ThemedText } from '@/components/themed-text';
import { Avatar, Badge, DataStatus, SectionHeader } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { useCity } from '@/hooks/use-city';
import { useDirectory } from '@/hooks/use-directory';
import { useTheme } from '@/hooks/use-theme';
import { DAY_SHORT, formatDay, localNow, openStatus, parseHours } from '@/lib/hours';
import {
  callBusiness,
  formatPhone,
  openInstagram,
  openMaps,
  openWebsite,
  prettyUrl,
} from '@/lib/links';

/** Велика квадратна кнопка дії: іконка зверху, підпис знизу */
function BigAction({
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
        styles.bigAction,
        { backgroundColor: primary ? theme.accent : theme.accentSoft },
        pressed && styles.pressed,
      ]}>
      <Icon name={icon} size={20} color={fg} />
      <ThemedText type="smallBold" style={{ color: fg }} numberOfLines={1}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export default function BusinessScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { city } = useCity();
  const { businesses, categories, loading, error, reload } = useDirectory();

  const business = businesses.find((b) => b.id === id);

  if (!business) {
    return (
      <View style={[styles.flex, { backgroundColor: theme.background }]}>
        {loading || error ? (
          <DataStatus loading={loading} error={error} onRetry={reload} />
        ) : (
          <ThemedText themeColor="textSecondary" style={styles.notFound}>
            Заклад не знайдено. Можливо, його прибрали з каталогу.
          </ThemedText>
        )}
      </View>
    );
  }

  const category = categories.find((c) => c.id === business.categoryId);
  const timezone = city?.timezone ?? 'America/Chicago';
  const week = parseHours(business.hours);
  const status = week ? openStatus(week, timezone) : null;
  const today = localNow(timezone).day;

  const soon = (what: string) => Alert.alert('Скоро', `${what} з'явиться в наступних версіях.`);

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: '' }} />

      {/* Шапка: лого, назва, категорія, статус */}
      <View style={styles.hero}>
        <Avatar name={business.name} tint={category?.tint ?? '#E4E7EC'} size={84} />
        <ThemedText style={styles.name}>{business.name}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.center}>
          {[category && `${category.emoji} ${category.name}`, business.locality]
            .filter(Boolean)
            .join(' · ')}
        </ThemedText>
        {business.featured || business.isNew ? (
          <View style={styles.badges}>
            {business.featured ? <Badge label="★ Рекомендуємо" /> : null}
            {business.isNew ? <Badge label="Нове" tone="accent" /> : null}
          </View>
        ) : null}
        {status ? (
          <View
            style={[
              styles.status,
              { backgroundColor: status.open ? theme.successSoft : theme.dangerSoft },
            ]}>
            <View
              style={[styles.dot, { backgroundColor: status.open ? theme.success : theme.danger }]}
            />
            <ThemedText
              type="smallBold"
              style={{ color: status.open ? theme.success : theme.danger }}>
              {status.text}
            </ThemedText>
          </View>
        ) : null}
      </View>

      {/* Головні дії */}
      <View style={styles.actions}>
        {business.phone ? (
          <BigAction icon="call" label="Подзвонити" primary onPress={() => callBusiness(business)} />
        ) : null}
        <BigAction icon="directions" label="Маршрут" onPress={() => openMaps(business)} />
        {business.instagram ? (
          <BigAction icon="instagram" label="Instagram" onPress={() => openInstagram(business)} />
        ) : null}
        {business.website ? (
          <BigAction icon="website" label="Сайт" onPress={() => openWebsite(business)} />
        ) : null}
      </View>

      {/* Про заклад */}
      <View style={styles.block}>
        <SectionHeader title="Про заклад" />
        <ThemedText style={styles.about}>{business.about || business.description}</ThemedText>
      </View>

      {/* Години роботи */}
      {business.hours ? (
        <View style={styles.block}>
          <SectionHeader title="Години роботи" />
          <View
            style={[
              styles.card,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}>
            {week ? (
              week.map((day, i) => {
                const isToday = i === today;
                return (
                  <View
                    key={DAY_SHORT[i]}
                    style={[styles.hoursRow, isToday && { backgroundColor: theme.accentSoft }]}>
                    <ThemedText
                      style={[styles.hoursDay, isToday && { color: theme.accent, fontWeight: 800 }]}>
                      {DAY_SHORT[i]}
                      {isToday ? ' · сьогодні' : ''}
                    </ThemedText>
                    <ThemedText
                      themeColor={day ? 'text' : 'textSecondary'}
                      style={isToday && { color: theme.accent, fontWeight: 800 }}>
                      {formatDay(day)}
                    </ThemedText>
                  </View>
                );
              })
            ) : (
              // Текст не вдалося розібрати — показуємо як є
              <ThemedText style={styles.hoursRaw}>{business.hours}</ThemedText>
            )}
          </View>
        </View>
      ) : null}

      {/* Адреса й контакти */}
      <View style={styles.block}>
        <SectionHeader title="Контакти" />
        <ListGroup>
          {business.address ? (
            <ListRow
              icon="pin"
              tint="#E5484D"
              label={business.address}
              onPress={() => openMaps(business)}
              last={!business.phone && !business.instagram && !business.website}
            />
          ) : null}
          {business.phone ? (
            <ListRow
              icon="call"
              tint="#0E8F6E"
              label={formatPhone(business.phone)}
              onPress={() => callBusiness(business)}
              last={!business.instagram && !business.website}
            />
          ) : null}
          {business.instagram ? (
            <ListRow
              icon="instagram"
              tint="#C23B6B"
              label={`@${business.instagram.replace(/^@/, '')}`}
              onPress={() => openInstagram(business)}
              last={!business.website}
            />
          ) : null}
          {business.website ? (
            <ListRow
              icon="website"
              tint="#1F4FD1"
              label={prettyUrl(business.website)}
              onPress={() => openWebsite(business)}
              last
            />
          ) : null}
        </ListGroup>
      </View>

      {/* Для власника — перший крок до платних профілів */}
      <View style={[styles.owner, { backgroundColor: theme.highlightSoft, borderColor: theme.highlight }]}>
        <ThemedText style={styles.ownerTitle}>Це ваш заклад?</ThemedText>
        <ThemedText themeColor="textSecondary">
          Додайте фото, меню й актуальні години — безкоштовно. Дивіться, скільки людей переглядали ваш
          профіль і дзвонили вам.
        </ThemedText>
        <Pressable
          onPress={() => soon('Керування профілем')}
          style={({ pressed }) => [
            styles.ownerButton,
            { backgroundColor: theme.highlightText },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="smallBold" style={{ color: theme.highlight }}>
            Керувати профілем
          </ThemedText>
        </Pressable>
      </View>

      <Pressable
        onPress={() => soon('Повідомлення про помилку')}
        hitSlop={8}
        style={({ pressed }) => [styles.report, pressed && styles.pressed]}>
        <Icon name="flag" size={13} color={theme.textSecondary} />
        <ThemedText type="small" themeColor="textSecondary">
          Повідомити про неточність
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  pressed: { opacity: 0.7 },
  content: {
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  notFound: {
    textAlign: 'center',
    padding: Spacing.five,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  name: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: 800,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginTop: Spacing.one,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + Spacing.half,
    marginTop: Spacing.one,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  bigAction: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.three,
    borderRadius: Radius.md,
  },
  block: {
    gap: Spacing.three,
  },
  about: {
    paddingHorizontal: Spacing.three,
    lineHeight: 24,
  },
  card: {
    marginHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    paddingVertical: Spacing.one,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  hoursDay: {
    fontWeight: 600,
  },
  hoursRaw: {
    padding: Spacing.three,
  },
  owner: {
    marginHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  ownerTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 800,
  },
  ownerButton: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingVertical: Spacing.two + Spacing.one,
    paddingHorizontal: Spacing.four,
    marginTop: Spacing.two,
  },
  report: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
});
