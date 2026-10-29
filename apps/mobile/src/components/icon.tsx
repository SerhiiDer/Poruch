import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';
import type { ColorValue } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

// Одна іконка — дві назви: SF Symbol для iOS і Material Symbol для Android/вебу.
export const Icons = {
  search: { ios: 'magnifyingglass', android: 'search' },
  call: { ios: 'phone.fill', android: 'call' },
  directions: { ios: 'location.north.fill', android: 'directions' },
  instagram: { ios: 'camera.fill', android: 'photo_camera' },
  chevron: { ios: 'chevron.right', android: 'chevron_right' },
  heart: { ios: 'heart', android: 'favorite' },
  bell: { ios: 'bell.fill', android: 'notifications' },
  globe: { ios: 'globe', android: 'language' },
  addBusiness: { ios: 'storefront.fill', android: 'add_business' },
  pin: { ios: 'mappin.and.ellipse', android: 'location_on' },
  ticket: { ios: 'ticket.fill', android: 'confirmation_number' },
  calendar: { ios: 'calendar', android: 'calendar_month' },
  info: { ios: 'info.circle.fill', android: 'info' },
  mail: { ios: 'envelope.fill', android: 'mail' },
  star: { ios: 'star.fill', android: 'star' },
} as const satisfies Record<string, { ios: SFSymbol; android: AndroidSymbol }>;

export type IconName = keyof typeof Icons;

type Props = {
  name: IconName;
  size?: number;
  color?: ColorValue;
};

export function Icon({ name, size = 18, color }: Props) {
  const theme = useTheme();
  const { ios, android } = Icons[name];
  return (
    <SymbolView
      name={{ ios, android, web: android }}
      size={size}
      tintColor={color ?? theme.text}
    />
  );
}
