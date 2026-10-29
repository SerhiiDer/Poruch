// Обране місто: зберігається на телефоні, доступне на всіх екранах через useCity().

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, use, useEffect, useState } from 'react';

import { findCity, type City } from '@/data/cities';

const STORAGE_KEY = 'poruch.cityId';

type CityState = {
  /** Поки читаємо збережене місто з телефону */
  loading: boolean;
  /** null — людина ще не вибрала місто */
  city: City | null;
  setCity: (id: string) => void;
};

const CityContext = createContext<CityState | null>(null);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [cityId, setCityId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(setCityId)
      .catch(() => {}) // не вийшло прочитати — просто спитаємо місто ще раз
      .finally(() => setLoading(false));
  }, []);

  const setCity = (id: string) => {
    setCityId(id);
    AsyncStorage.setItem(STORAGE_KEY, id).catch(() => {});
  };

  return (
    <CityContext value={{ loading, city: findCity(cityId) ?? null, setCity }}>
      {children}
    </CityContext>
  );
}

export function useCity() {
  const ctx = use(CityContext);
  if (!ctx) throw new Error('useCity() треба викликати всередині <CityProvider>');
  return ctx;
}
