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
};

export const cities: City[] = [
  { id: 'chicago', name: 'Чикаго', area: 'Чикаго й передмістя', launched: true },
  { id: 'new-york', name: 'Нью-Йорк', area: 'Нью-Йорк і Нью-Джерсі', launched: false },
  { id: 'philadelphia', name: 'Філадельфія', area: 'Філадельфія й околиці', launched: false },
  { id: 'los-angeles', name: 'Лос-Анджелес', area: 'Лос-Анджелес і округ', launched: false },
  { id: 'seattle', name: 'Сіетл', area: 'Сіетл і передмістя', launched: false },
  { id: 'sacramento', name: 'Сакраменто', area: 'Сакраменто й околиці', launched: false },
  { id: 'detroit', name: 'Детройт', area: 'Детройт і передмістя', launched: false },
];

export function findCity(id: string | null | undefined) {
  return cities.find((c) => c.id === id && c.launched);
}
