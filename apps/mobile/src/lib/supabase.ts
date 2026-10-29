// Підключення до бази Supabase. Ключі — у файлі .env.
//
// Сесію входу (знадобиться для адмінки) зберігаємо в AsyncStorage:
// він працює і на телефоні, і у веб-версії.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import type { Database } from '@/data/database.types';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error('Немає EXPO_PUBLIC_SUPABASE_URL або EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY у файлі .env');
}

// Коли веб-сторінка рендериться на сервері, сховища ще немає.
const hasStorage = typeof window !== 'undefined';

// Типи таблиць генеруються з бази: `npm run db:types` у корені проєкту.
export const supabase = createClient<Database>(url, key, {
  auth: {
    storage: hasStorage ? AsyncStorage : undefined,
    persistSession: hasStorage,
    autoRefreshToken: hasStorage,
    detectSessionInUrl: false,
  },
});

// Оновлюємо токен входу, лише поки застосунок відкритий.
if (hasStorage) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
