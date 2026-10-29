-- =====================================================================
-- Демо-дані: ВИГАДАНІ заклади й івенти, щоб застосунок не був порожнім.
-- Запускати ПІСЛЯ migrations/..._init.sql (SQL Editor → New query → Run).
--
-- Прибрати перед запуском зі справжніми даними:
--   delete from public.businesses;  delete from public.events;
-- =====================================================================

insert into public.businesses
  (city_id, category_id, name, locality, address, description, phone, instagram, featured, created_at)
values
  ('chicago', 'food',     'Пекарня «Колосок»',        'Chicago',           'Chicago Ave, Chicago, IL',    'Паляниці, пампушки й торти на замовлення',    '+13125550101', 'kolosok.demo', true,  now() - interval '90 days'),
  ('chicago', 'food',     'Ресторан «Вареник»',       'Chicago',           'W Chicago Ave, Chicago, IL',  'Домашня кухня, борщ і вареники щодня',        '+13125550102', null,           false, now() - interval '3 days'),
  ('chicago', 'shops',    'Гастроном «Смаколик»',     'Palatine',          'Palatine, IL',                'Українські продукти, ковбаси, сири',          '+18475550103', null,           false, now() - interval '90 days'),
  ('chicago', 'beauty',   'Салон «Калина»',           'Schaumburg',        'Schaumburg, IL',              'Стрижки, манікюр, брови',                     null,           'kalyna.demo',  false, now() - interval '5 days'),
  ('chicago', 'services', 'Автосервіс «Майстер»',     'Des Plaines',       'Des Plaines, IL',             'Ремонт і діагностика, говоримо українською',  '+18475550105', null,           false, now() - interval '90 days'),
  ('chicago', 'health',   'Стоматологія «Посмішка»',  'Arlington Heights', 'Arlington Heights, IL',       'Лікар-стоматолог з України',                  '+18475550106', null,           false, now() - interval '7 days'),
  ('chicago', 'kids',     'Суботня школа «Барвінок»', 'Chicago',           'Chicago, IL',                 'Українська мова, історія й традиції для дітей', null,         null,           false, now() - interval '90 days'),
  ('chicago', 'legal',    'Юрист «Право»',            'Chicago',           'Downtown Chicago, IL',        'Імміграція, TPS, U4U, документи',             '+13125550108', null,           false, now() - interval '90 days');

-- Дати івентів — від сьогодні (за часом Чикаго), щоб список виглядав «свіжим».
insert into public.events (city_id, title, starts_at, place, price, tags)
select 'chicago', title,
       (date_trunc('day', now() at time zone 'America/Chicago') + starts_in) at time zone 'America/Chicago',
       place, price, tags::text[]
from (values
  ('Вечір української пісні',            interval '0 days 19 hours', 'Ukrainian Village, Chicago', '$15',         '{music}'),
  ('Ярмарок вишиванок',                  interval '2 days 11 hours', 'Palatine, IL',               'Безкоштовно', '{free,fair}'),
  ('Майстер-клас з писанок для дітей',   interval '3 days 13 hours', 'Bloomingdale, IL',           '$10',         '{kids}'),
  ('Дитячий футбол у парку',             interval '4 days 10 hours', 'Humboldt Park',              'Безкоштовно', '{kids,free}'),
  ('Нетворкінг українських підприємців', interval '6 days 18 hours', 'Downtown Chicago',           '$25',         '{business}'),
  ('Концерт гурту «Демо»',               interval '9 days 20 hours', 'Chicago, IL',                '$30',         '{music}')
) as e(title, starts_in, place, price, tags);
