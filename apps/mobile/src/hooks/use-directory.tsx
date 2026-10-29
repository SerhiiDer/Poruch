// Заклади, категорії та івенти для вибраного міста — з бази Supabase.
// Завантажуються один раз і доступні на всіх екранах через useDirectory().

import { createContext, use, useCallback, useEffect, useState } from 'react';

import type { Business, Category, EventItem, EventTag } from '@/data/types';
import { useCity } from '@/hooks/use-city';
import { supabase } from '@/lib/supabase';

const NEW_DAYS = 30;

type DirectoryState = {
  loading: boolean;
  /** Текст помилки, якщо не вдалося завантажити (наприклад, немає інтернету) */
  error: string | null;
  categories: Category[];
  businesses: Business[];
  events: EventItem[];
  reload: () => void;
};

const DirectoryContext = createContext<DirectoryState | null>(null);

async function load(cityId: string) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Три запити паралельно. Неопубліковані записи база не віддасть сама (правила RLS).
  const [cats, biz, evs] = await Promise.all([
    supabase.from('categories').select('id, name, emoji, tint').order('sort'),
    supabase
      .from('businesses')
      .select(
        'id, name, category_id, locality, address, description, about, hours, phone, instagram, website, featured, created_at',
      )
      .eq('city_id', cityId)
      .order('name'),
    supabase
      .from('events')
      .select('id, title, starts_at, place, price, tags')
      .eq('city_id', cityId)
      .gte('starts_at', startOfToday.toISOString())
      .order('starts_at'),
  ]);

  const failed = cats.error ?? biz.error ?? evs.error;
  if (failed) throw new Error(failed.message);

  const newSince = Date.now() - NEW_DAYS * 24 * 60 * 60 * 1000;

  return {
    categories: cats.data as Category[],
    businesses: (biz.data ?? []).map(
      (b): Business => ({
        id: b.id,
        name: b.name,
        categoryId: b.category_id,
        locality: b.locality,
        address: b.address,
        description: b.description,
        about: b.about ?? undefined,
        hours: b.hours ?? undefined,
        phone: b.phone ?? undefined,
        instagram: b.instagram ?? undefined,
        website: b.website ?? undefined,
        featured: b.featured,
        isNew: new Date(b.created_at).getTime() > newSince,
      }),
    ),
    events: (evs.data ?? []).map(
      (e): EventItem => ({
        id: e.id,
        title: e.title,
        startsAt: e.starts_at,
        place: e.place,
        price: e.price ?? undefined,
        tags: (e.tags ?? []) as EventTag[],
      }),
    ),
  };
}

export function DirectoryProvider({ children }: { children: React.ReactNode }) {
  const { city } = useCity();
  const cityId = city?.id;
  const [attempt, setAttempt] = useState(0);
  // Останні успішно завантажені дані — показуємо їх, поки вантажаться нові.
  const [data, setData] = useState<Awaited<ReturnType<typeof load>> | null>(null);
  // Яке завантаження вже закінчилося (місто + спроба) і з якою помилкою.
  const [done, setDone] = useState<{ key: string; error: string | null } | null>(null);

  const key = `${cityId}#${attempt}`;
  const loading = !!cityId && done?.key !== key;
  const error = done?.key === key ? done.error : null;

  useEffect(() => {
    if (!cityId) return;
    let cancelled = false; // якщо місто змінилося до відповіді — стару відповідь ігноруємо
    load(cityId)
      .then((d) => {
        if (cancelled) return;
        setData(d);
        setDone({ key, error: null });
      })
      .catch((e: Error) => {
        if (!cancelled) setDone({ key, error: e.message });
      });
    return () => {
      cancelled = true;
    };
  }, [cityId, key]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return (
    <DirectoryContext
      value={{
        loading,
        error,
        categories: data?.categories ?? [],
        businesses: data?.businesses ?? [],
        events: data?.events ?? [],
        reload,
      }}>
      {children}
    </DirectoryContext>
  );
}

export function useDirectory() {
  const ctx = use(DirectoryContext);
  if (!ctx) throw new Error('useDirectory() треба викликати всередині <DirectoryProvider>');
  return ctx;
}
