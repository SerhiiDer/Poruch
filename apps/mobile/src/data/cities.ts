// Міста (точніше регіони: місто + передмістя).
// Поки що працює лише Чикаго, решта — «Скоро».
// Потім цей список переїде в таблицю `cities` у Supabase.

export type City = {
  id: string;
  name: string;
  /** Що входить у регіон — підпис під назвою */
  area: string;
  /** Чи вже є заклади й івенти для цього міста */
  launched: boolean;
  /** Часовий пояс — щоб правильно рахувати «Відчинено зараз» */
  timezone: string;
};

export const cities: City[] = [
  { id: 'chicago', name: 'Чикаго', area: 'Чикаго й передмістя', launched: true, timezone: 'America/Chicago' },
  { id: 'new-york', name: 'Нью-Йорк', area: 'Нью-Йорк і Нью-Джерсі', launched: false, timezone: 'America/New_York' },
  { id: 'philadelphia', name: 'Філадельфія', area: 'Філадельфія й околиці', launched: false, timezone: 'America/New_York' },
  { id: 'los-angeles', name: 'Лос-Анджелес', area: 'Лос-Анджелес і округ', launched: false, timezone: 'America/Los_Angeles' },
  { id: 'seattle', name: 'Сіетл', area: 'Сіетл і передмістя', launched: false, timezone: 'America/Los_Angeles' },
  { id: 'sacramento', name: 'Сакраменто', area: 'Сакраменто й околиці', launched: false, timezone: 'America/Los_Angeles' },
  { id: 'detroit', name: 'Детройт', area: 'Детройт і передмістя', launched: false, timezone: 'America/Detroit' },
];

export function findCity(id: string | null | undefined) {
  return cities.find((c) => c.id === id && c.launched);
}
