// Типи даних застосунку. Самі дані — у базі Supabase.

export type Category = {
  id: string;
  name: string;
  emoji: string;
  /** Пастельний колір плитки категорії */
  tint: string;
};

export type Business = {
  id: string;
  name: string;
  categoryId: string;
  /** Місто чи передмістя всередині регіону: Palatine, Schaumburg… */
  locality: string;
  address: string;
  description: string;
  phone?: string;
  instagram?: string;
  website?: string;
  /** Доданий за останні 30 днів */
  isNew: boolean;
  /** Місце «Рекомендуємо» (у майбутньому платне) */
  featured: boolean;
};

export type EventTag = 'free' | 'kids' | 'music' | 'business' | 'fair';

export type EventItem = {
  id: string;
  title: string;
  startsAt: string; // ISO-дата
  place: string;
  price?: string;
  tags: EventTag[];
};

export const eventTagLabels: Record<EventTag, string> = {
  free: 'Безкоштовно',
  kids: 'Для дітей',
  music: 'Музика',
  business: 'Бізнес',
  fair: 'Ярмарок',
};
