// Тимчасові демо-дані, поки не підключили Supabase.
// Усі назви вигадані — це не справжні заклади.

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
  city: string;
  address: string;
  description: string;
  phone?: string;
  instagram?: string;
  isNew?: boolean;
  /** Платне місце «Рекомендуємо» (у майбутньому) */
  featured?: boolean;
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

export const categories: Category[] = [
  { id: 'food', name: 'Ресторани й кафе', emoji: '🍽️', tint: '#FFE7C2' },
  { id: 'shops', name: 'Магазини', emoji: '🛒', tint: '#D9F2E3' },
  { id: 'beauty', name: 'Краса', emoji: '💇', tint: '#FFDCE5' },
  { id: 'services', name: 'Сервіси', emoji: '🛠️', tint: '#DCE6FF' },
  { id: 'health', name: 'Здоров’я', emoji: '🩺', tint: '#D6F1F5' },
  { id: 'community', name: 'Церкви й громади', emoji: '⛪', tint: '#EADFFF' },
  { id: 'kids', name: 'Діти й освіта', emoji: '🎒', tint: '#FFF3B8' },
  { id: 'legal', name: 'Юристи й фінанси', emoji: '💼', tint: '#E4E7EC' },
];

export const businesses: Business[] = [
  {
    id: '1',
    name: 'Пекарня «Колосок»',
    categoryId: 'food',
    city: 'Chicago',
    address: 'Chicago Ave, Chicago, IL',
    description: 'Паляниці, пампушки й торти на замовлення',
    phone: '+13125550101',
    instagram: 'kolosok.demo',
    featured: true,
  },
  {
    id: '2',
    name: 'Ресторан «Вареник»',
    categoryId: 'food',
    city: 'Chicago',
    address: 'W Chicago Ave, Chicago, IL',
    description: 'Домашня кухня, борщ і вареники щодня',
    phone: '+13125550102',
    isNew: true,
  },
  {
    id: '3',
    name: 'Гастроном «Смаколик»',
    categoryId: 'shops',
    city: 'Palatine',
    address: 'Palatine, IL',
    description: 'Українські продукти, ковбаси, сири',
    phone: '+18475550103',
  },
  {
    id: '4',
    name: 'Салон «Калина»',
    categoryId: 'beauty',
    city: 'Schaumburg',
    address: 'Schaumburg, IL',
    description: 'Стрижки, манікюр, брови',
    instagram: 'kalyna.demo',
    isNew: true,
  },
  {
    id: '5',
    name: 'Автосервіс «Майстер»',
    categoryId: 'services',
    city: 'Des Plaines',
    address: 'Des Plaines, IL',
    description: 'Ремонт і діагностика, говоримо українською',
    phone: '+18475550105',
  },
  {
    id: '6',
    name: 'Стоматологія «Посмішка»',
    categoryId: 'health',
    city: 'Arlington Heights',
    address: 'Arlington Heights, IL',
    description: 'Лікар-стоматолог з України',
    phone: '+18475550106',
    isNew: true,
  },
  {
    id: '7',
    name: 'Суботня школа «Барвінок»',
    categoryId: 'kids',
    city: 'Chicago',
    address: 'Chicago, IL',
    description: 'Українська мова, історія й традиції для дітей',
  },
  {
    id: '8',
    name: 'Юрист «Право»',
    categoryId: 'legal',
    city: 'Chicago',
    address: 'Downtown Chicago, IL',
    description: 'Імміграція, TPS, U4U, документи',
    phone: '+13125550108',
  },
];

// Дати рахуємо від сьогодні, щоб список завжди виглядав «свіжим».
function daysFromNow(days: number, hour: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const events: EventItem[] = [
  { id: 'e1', title: 'Вечір української пісні', startsAt: daysFromNow(0, 19), place: 'Ukrainian Village, Chicago', price: '$15', tags: ['music'] },
  { id: 'e2', title: 'Ярмарок вишиванок', startsAt: daysFromNow(2, 11), place: 'Palatine, IL', price: 'Безкоштовно', tags: ['free', 'fair'] },
  { id: 'e3', title: 'Майстер-клас з писанок для дітей', startsAt: daysFromNow(3, 13), place: 'Bloomingdale, IL', price: '$10', tags: ['kids'] },
  { id: 'e4', title: 'Нетворкінг українських підприємців', startsAt: daysFromNow(6, 18), place: 'Downtown Chicago', price: '$25', tags: ['business'] },
  { id: 'e5', title: 'Дитячий футбол у парку', startsAt: daysFromNow(4, 10), place: 'Humboldt Park', price: 'Безкоштовно', tags: ['kids', 'free'] },
  { id: 'e6', title: 'Концерт гурту «Демо»', startsAt: daysFromNow(9, 20), place: 'Chicago, IL', price: '$30', tags: ['music'] },
];

export const eventTagLabels: Record<EventTag, string> = {
  free: 'Безкоштовно',
  kids: 'Для дітей',
  music: 'Музика',
  business: 'Бізнес',
  fair: 'Ярмарок',
};
