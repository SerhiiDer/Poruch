// Дії з закладом: подзвонити, маршрут, Instagram, сайт.
// Пізніше тут же рахуватимемо кліки для статистики власників.

import { Linking } from 'react-native';

import type { Business } from '@/data/types';

export const callBusiness = (b: Business) => b.phone && Linking.openURL(`tel:${b.phone}`);

export const openMaps = (b: Business) =>
  Linking.openURL(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.name} ${b.address}`)}`,
  );

export const openInstagram = (b: Business) =>
  b.instagram && Linking.openURL(`https://instagram.com/${b.instagram.replace(/^@/, '')}`);

export const openWebsite = (b: Business) =>
  b.website && Linking.openURL(/^https?:\/\//.test(b.website) ? b.website : `https://${b.website}`);

/** +13125550101 → (312) 555-0101 */
export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  const local = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
  if (local.length !== 10) return phone;
  return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
}

/** https://www.example.com/ → example.com */
export const prettyUrl = (url: string) =>
  url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
