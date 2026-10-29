// Вибір міста «Звідки ви?».
// - CityPickerContent — сам список; при першому запуску показується як окремий екран.
// - CityPicker — той самий список у спливному вікні, щоб змінити місто пізніше.

import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { cities } from '@/data/cities';
import { useCity } from '@/hooks/use-city';
import { useTheme } from '@/hooks/use-theme';

export function CityPickerContent({ onClose }: { onClose?: () => void }) {
  const theme = useTheme();
  const { city, setCity } = useCity();

  const launched = cities.filter((c) => c.launched);
  const soon = cities.filter((c) => !c.launched);

  const pick = (id: string) => {
    setCity(id);
    onClose?.();
  };

  return (
    <ScrollView
      style={[styles.flex, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}>
      <View style={styles.topRow}>
        <ThemedText style={[styles.logo, { color: theme.accent }]}>Поруч</ThemedText>
        {onClose ? (
          <Pressable
            onPress={onClose}
            hitSlop={12}
            accessibilityLabel="Закрити"
            style={[styles.close, { backgroundColor: theme.backgroundSelected }]}>
            <Icon name="close" size={14} color={theme.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      <ThemedText style={styles.title}>Звідки ви?</ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.lead}>
        Покажемо українські заклади, послуги й івенти поруч з вами.
      </ThemedText>

      <View style={styles.list}>
        {launched.map((c) => {
          const selected = city?.id === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => pick(c.id)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: selected ? theme.accent : theme.border,
                },
                pressed && styles.pressed,
              ]}>
              <ThemedText style={styles.flag}>🇺🇦</ThemedText>
              <View style={styles.flex}>
                <ThemedText style={styles.cityName}>{c.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {c.area}
                </ThemedText>
              </View>
              {selected ? (
                <Icon name="check" size={22} color={theme.accent} />
              ) : (
                <Icon name="chevron" size={14} color={theme.textSecondary} />
              )}
            </Pressable>
          );
        })}
      </View>

      <ThemedText style={styles.soonTitle}>Скоро</ThemedText>
      <View
        style={[
          styles.soonGroup,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        {soon.map((c, i) => (
          <View
            key={c.id}
            style={[
              styles.soonRow,
              i < soon.length - 1 && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: theme.border,
              },
            ]}>
            <ThemedText themeColor="textSecondary" style={styles.flex}>
              {c.name}
            </ThemedText>
            <Badge label="Скоро" tone="accent" />
          </View>
        ))}
      </View>
      <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
        Вашого міста ще немає? Ми додаємо нові міста, щойно там набирається досить закладів. Поки
        що можна дивитися Чикаго.
      </ThemedText>
    </ScrollView>
  );
}

/** Вікно зміни міста (з головної та з «Я») */
export function CityPicker({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <CityPickerContent onClose={onClose} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  content: {
    padding: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 30,
  },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: 800,
    letterSpacing: -0.8,
    marginTop: Spacing.two,
  },
  lead: {
    marginTop: Spacing.two,
  },
  list: {
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 2,
  },
  flag: {
    fontSize: 30,
    lineHeight: 36,
  },
  cityName: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 800,
  },
  soonTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 700,
    marginTop: Spacing.five,
    marginBottom: Spacing.three,
  },
  soonGroup: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  soonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three - Spacing.one,
    minHeight: 50,
  },
  note: {
    marginTop: Spacing.three,
  },
});
