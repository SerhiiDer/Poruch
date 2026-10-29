-- =====================================================================
-- Поруч: початкова структура бази.
--
-- Як запустити: Supabase → SQL Editor → New query →
-- вставити ВЕСЬ файл → Run. Запускати один раз.
-- =====================================================================


-- ---------- Таблиці ----------

-- Міста (регіони: місто + передмістя). launched = чи вже показуємо в застосунку.
create table public.cities (
  id        text primary key,               -- 'chicago'
  name      text not null,                  -- 'Чикаго'
  area      text not null,                  -- 'Чикаго й передмістя'
  launched  boolean not null default false,
  sort      int not null default 0
);

-- Категорії каталогу.
create table public.categories (
  id     text primary key,                  -- 'food'
  name   text not null,                     -- 'Ресторани й кафе'
  emoji  text not null,                     -- '🍽️'
  tint   text not null default '#E4E7EC',   -- пастельний колір плитки
  sort   int not null default 0
);

-- Заклади й бізнеси.
create table public.businesses (
  id           uuid primary key default gen_random_uuid(),
  city_id      text not null references public.cities(id),
  category_id  text not null references public.categories(id),
  name         text not null,
  description  text not null default '',
  locality     text not null default '',    -- місто/передмістя: 'Palatine'
  address      text not null default '',
  phone        text,                        -- у форматі +13125550101
  instagram    text,                        -- лише нікнейм, без @ і без посилання
  website      text,
  featured     boolean not null default false,  -- «Рекомендуємо»
  published    boolean not null default true,   -- false = прихований чорновик
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index businesses_city_category_idx on public.businesses (city_id, category_id);

-- Івенти.
create table public.events (
  id          uuid primary key default gen_random_uuid(),
  city_id     text not null references public.cities(id),
  title       text not null,
  starts_at   timestamptz not null,
  place       text not null default '',
  price       text,                          -- '$15', 'Безкоштовно'
  tags        text[] not null default '{}'   -- {free,kids,music,business,fair}
              check (tags <@ array['free','kids','music','business','fair']),
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index events_city_starts_idx on public.events (city_id, starts_at);

-- Адміни застосунку (знадобиться для адмін-екрана в застосунку).
-- Додати себе: після першого входу в застосунок —
--   insert into public.admins (user_id) values ('<твій user id з Authentication → Users>');
create table public.admins (
  user_id  uuid primary key references auth.users(id) on delete cascade
);


-- ---------- updated_at оновлюється сам ----------

create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger businesses_updated_at before update on public.businesses
  for each row execute function public.set_updated_at();
create trigger events_updated_at before update on public.events
  for each row execute function public.set_updated_at();


-- ---------- Хто адмін ----------

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;


-- ---------- Безпека (RLS) ----------
-- Читати можуть усі (лише опубліковане). Змінювати — лише адміни.
-- Таблиця Table Editor у панелі Supabase ці правила обходить — там ти завжди адмін.

alter table public.cities     enable row level security;
alter table public.categories enable row level security;
alter table public.businesses enable row level security;
alter table public.events     enable row level security;
alter table public.admins     enable row level security;  -- без правил = ніхто через API

create policy "Усі бачать міста"     on public.cities     for select to anon, authenticated using (true);
create policy "Усі бачать категорії" on public.categories for select to anon, authenticated using (true);
create policy "Усі бачать опубліковані заклади" on public.businesses
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "Усі бачать опубліковані івенти" on public.events
  for select to anon, authenticated using (published or (select public.is_admin()));

create policy "Адміни змінюють міста"     on public.cities
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Адміни змінюють категорії" on public.categories
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Адміни змінюють заклади"   on public.businesses
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Адміни змінюють івенти"    on public.events
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Доступ через API (бо «Automatically expose new tables» вимкнено).
grant select on public.cities, public.categories, public.businesses, public.events to anon, authenticated;
grant insert, update, delete on public.cities, public.categories, public.businesses, public.events to authenticated;
revoke all on public.admins from anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;


-- ---------- Початкові дані ----------

insert into public.cities (id, name, area, launched, sort) values
  ('chicago',      'Чикаго',       'Чикаго й передмістя',    true,  1),
  ('new-york',     'Нью-Йорк',     'Нью-Йорк і Нью-Джерсі',  false, 2),
  ('philadelphia', 'Філадельфія',  'Філадельфія й околиці',  false, 3),
  ('los-angeles',  'Лос-Анджелес', 'Лос-Анджелес і округ',   false, 4),
  ('seattle',      'Сіетл',        'Сіетл і передмістя',     false, 5),
  ('sacramento',   'Сакраменто',   'Сакраменто й околиці',   false, 6),
  ('detroit',      'Детройт',      'Детройт і передмістя',   false, 7);

insert into public.categories (id, name, emoji, tint, sort) values
  ('food',      'Ресторани й кафе',  '🍽️', '#FFE7C2', 1),
  ('shops',     'Магазини',          '🛒', '#D9F2E3', 2),
  ('beauty',    'Краса',             '💇', '#FFDCE5', 3),
  ('services',  'Сервіси',           '🛠️', '#DCE6FF', 4),
  ('health',    'Здоров’я',          '🩺', '#D6F1F5', 5),
  ('community', 'Церкви й громади',  '⛪', '#EADFFF', 6),
  ('kids',      'Діти й освіта',     '🎒', '#FFF3B8', 7),
  ('legal',     'Юристи й фінанси',  '💼', '#E4E7EC', 8);
