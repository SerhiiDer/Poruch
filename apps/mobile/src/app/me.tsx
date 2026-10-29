import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

import { CityPicker } from '@/components/city-picker';
import { Icon, type IconName } from '@/components/icon';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Screen, SectionHeader } from '@/components/ui';
import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { useCity } from '@/hooks/use-city';
import { useTheme } from '@/hooks/use-theme';

// Поки що кнопки показують «Скоро». Справжні форми з'являться після підключення бази.
const soon = (what: string) => Alert.alert('Скоро', `${what} з'явиться в наступних версіях.`);

function Row({
  icon,
  tint,
  label,
  value,
  right,
  onPress,
  last,
}: {
  icon: IconName;
  tint: string;
  label: string;
  value?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  last?: boolean;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
        pressed && { backgroundColor: theme.backgroundSelected },
      ]}>
      <View style={[styles.rowIcon, { backgroundColor: tint }]}>
        <Icon name={icon} size={16} color="#FFFFFF" />
      </View>
      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      {value ? (
        <ThemedText type="small" themeColor="textSecondary">
          {value}
        </ThemedText>
      ) : null}
      {right ?? (onPress ? <Icon name="chevron" size={14} color={theme.textSecondary} /> : null)}
    </Pressable>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[styles.group, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      {children}
    </View>
  );
}

export default function MeScreen() {
  const theme = useTheme();
  const [notify, setNotify] = useState(true);
  const { city } = useCity();
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.five }}>
        <ScreenHeader title="Я" subtitle="Без реєстрації — усе зберігається на телефоні" />

        <View style={styles.sections}>
          {/* Обране */}
          <View style={styles.block}>
            <SectionHeader title="Обране" />
            <View
              style={[
                styles.emptyFav,
                { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              ]}>
              <ThemedText style={styles.emptyEmoji}>🤍</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.center}>
                Тут будуть заклади й івенти, які ви збережете сердечком
              </ThemedText>
            </View>
          </View>

          {/* Для бізнесу — жовта картка-заклик */}
          <View
            style={[styles.cta, { backgroundColor: theme.highlight }]}>
            <ThemedText style={[styles.ctaTitle, { color: theme.highlightText }]}>
              Маєте український бізнес?
            </ThemedText>
            <ThemedText style={{ color: theme.highlightText }}>
              Додайте його в каталог безкоштовно — люди з громади знайдуть вас.
            </ThemedText>
            <Pressable
              onPress={() => soon('Форма додавання бізнесу')}
              style={({ pressed }) => [
                styles.ctaButton,
                { backgroundColor: theme.highlightText },
                pressed && { opacity: 0.8 },
              ]}>
              <Icon name="addBusiness" size={16} color={theme.highlight} />
              <ThemedText type="smallBold" style={{ color: theme.highlight }}>
                Додати бізнес
              </ThemedText>
            </Pressable>
          </View>

          {/* Внесок громади */}
          <Group>
            <Row
              icon="calendar"
              tint="#1F4FD1"
              label="Запропонувати івент"
              onPress={() => soon('Форма для івентів')}
            />
            <Row
              icon="mail"
              tint="#0E8F6E"
              label="Написати нам"
              onPress={() => soon('Зворотний зв’язок')}
              last
            />
          </Group>

          {/* Налаштування */}
          <View style={styles.block}>
            <SectionHeader title="Налаштування" />
            <Group>
              <Row
                icon="pin"
                tint="#E5484D"
                label="Місто"
                value={city?.name}
                onPress={() => setPickerOpen(true)}
              />
              <Row
                icon="globe"
                tint="#6A3FD1"
                label="Мова"
                value="Українська"
                onPress={() => soon('Англійська версія')}
              />
              <Row
                icon="bell"
                tint="#F2A007"
                label="Нові івенти"
                right={
                  <Switch
                    value={notify}
                    onValueChange={setNotify}
                    trackColor={{ true: theme.accent, false: theme.backgroundSelected }}
                  />
                }
                last
              />
            </Group>
          </View>

          <Group>
            <Row
              icon="info"
              tint="#6B6F80"
              label="Про застосунок"
              value="v0.1 демо"
              onPress={() =>
                Alert.alert(
                  'Поруч',
                  'Каталог українських бізнесів та івентів. Зараз це демо-версія з вигаданими даними.',
                )
              }
              last
            />
          </Group>
        </View>
      </ScrollView>
      <CityPicker visible={pickerOpen} onClose={() => setPickerOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  sections: {
    gap: Spacing.four,
  },
  block: {
    gap: Spacing.three,
  },
  emptyFav: {
    marginHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  emptyEmoji: {
    fontSize: 36,
    lineHeight: 44,
  },
  cta: {
    marginHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  ctaTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 800,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.two,
    marginTop: Spacing.two,
    borderRadius: Radius.pill,
    paddingVertical: Spacing.two + Spacing.one,
    paddingHorizontal: Spacing.four,
  },
  group: {
    marginHorizontal: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three - Spacing.one,
    minHeight: 54,
  },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
  },
});
