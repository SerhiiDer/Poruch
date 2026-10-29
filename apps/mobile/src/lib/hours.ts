// Години роботи закладу.
//
// У базі години — звичайний текст, який зручно набрати руками, наприклад:
//   Пн-Пт 9:00-18:00; Сб 10:00-16:00; Нд вихідний
// Рядки розділяються «;» або новим рядком. Розуміємо також:
//   «Щодня 8-20», «Пн, Ср 9:00-13:00, 14:00-18:00», «Сб-Нд зачинено», «Цілодобово».
// Якщо текст не вдалося розібрати — на екрані просто показуємо його як є.

/** Проміжок роботи у хвилинах від півночі. close ≤ open означає «до ранку наступного дня». */
export type Span = { open: number; close: number };
/** 7 днів, 0 = понеділок. null — вихідний */
export type Week = (Span[] | null)[];

export const DAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
/** «відчиниться в понеділок» */
const DAY_ACCUSATIVE = [
  'в понеділок',
  'у вівторок',
  'в середу',
  'в четвер',
  'в пʼятницю',
  'в суботу',
  'в неділю',
];

const DAY_PREFIXES: string[][] = [
  ['пн', 'пон', 'mon'],
  ['вт', 'вів', 'tue'],
  ['ср', 'сер', 'wed'],
  ['чт', 'чет', 'thu'],
  ['пт', 'пʼя', "п'я", 'п’я', 'пят', 'fri'],
  ['сб', 'суб', 'sat'],
  ['нд', 'нед', 'sun'],
];

const TIME_RANGE = /(\d{1,2})(?:[:.](\d{2}))?\s*[-–—]\s*(\d{1,2})(?:[:.](\d{2}))?/g;
const CLOSED = /вихідн|зачинен|closed/;
const ALL_DAY = /цілодоб|24\s*\/\s*7|24\s*год/;
const EVERY_DAY = /щодня|щоденно|daily|без вихідних/;

function dayIndex(token: string): number | undefined {
  const t = token.trim().replace(/\.$/, '');
  if (!t) return undefined;
  const i = DAY_PREFIXES.findIndex((prefixes) => prefixes.some((p) => t.startsWith(p)));
  return i === -1 ? undefined : i;
}

/** «пн-пт, сб» → [0,1,2,3,4,5]. undefined, якщо не схоже на дні. */
function parseDays(text: string): number[] | undefined {
  const cleaned = text.replace(/[:\s–—-]+$/, '').trim();
  if (cleaned === '' || EVERY_DAY.test(cleaned)) return [0, 1, 2, 3, 4, 5, 6];
  const days: number[] = [];
  for (const part of cleaned.split(',')) {
    const range = part.split(/\s*[-–—]\s*/);
    if (range.length === 2) {
      const from = dayIndex(range[0]);
      const to = dayIndex(range[1]);
      if (from === undefined || to === undefined) return undefined;
      for (let d = from; ; d = (d + 1) % 7) {
        days.push(d);
        if (d === to) break;
      }
    } else {
      const d = dayIndex(part);
      if (d === undefined) return undefined;
      days.push(d);
    }
  }
  return days;
}

export function parseHours(text: string | undefined): Week | null {
  if (!text?.trim()) return null;
  const week: (Span[] | null | undefined)[] = Array(7).fill(undefined);

  for (const rawLine of text.split(/[\n;]+/)) {
    // «без вихідних» — це «щодня», а не «вихідний»
    const line = rawLine.trim().toLowerCase().replace('без вихідних', 'щодня');
    if (!line) continue;

    // Де закінчуються дні й починається час чи «вихідний»
    const firstDigit = line.search(/\d/);
    const keyword = line.search(new RegExp(`${CLOSED.source}|${ALL_DAY.source}`));
    const starts = [firstDigit, keyword].filter((i) => i >= 0);
    if (starts.length === 0) return null;
    const split = Math.min(...starts);

    const days = parseDays(line.slice(0, split));
    if (!days) return null;
    const rest = line.slice(split);

    let value: Span[] | null;
    if (CLOSED.test(rest)) {
      value = null;
    } else if (ALL_DAY.test(rest)) {
      value = [{ open: 0, close: 24 * 60 }];
    } else {
      value = [...rest.matchAll(TIME_RANGE)].map((m) => ({
        open: Number(m[1]) * 60 + Number(m[2] ?? 0),
        close: Number(m[3]) * 60 + Number(m[4] ?? 0),
      }));
      if (value.length === 0) return null;
    }
    for (const d of days) week[d] = value;
  }
  // Дні, яких немає в тексті («Пн-Пт 9-17»), вважаємо вихідними.
  return week.map((d) => (d === undefined ? null : d));
}

function formatMinutes(m: number) {
  const mins = m % (24 * 60);
  return `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;
}

export function formatDay(day: Span[] | null) {
  if (day === null) return 'Зачинено';
  if (day.length === 1 && day[0].open === 0 && day[0].close === 24 * 60) return 'Цілодобово';
  return day.map((s) => `${formatMinutes(s.open)}–${formatMinutes(s.close)}`).join(', ');
}

/** Поточний день тижня (0 = Пн) і хвилини від півночі в часовому поясі міста */
export function localNow(timezone: string, now = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(now);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
    const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'));
    const minutes = (Number(get('hour')) % 24) * 60 + Number(get('minute'));
    if (day >= 0 && !Number.isNaN(minutes)) return { day, minutes };
  } catch {
    // Якщо телефон не знає часових поясів — беремо його власний час.
  }
  return { day: (now.getDay() + 6) % 7, minutes: now.getHours() * 60 + now.getMinutes() };
}

export type OpenStatus = { open: boolean; text: string };

/** «Відчинено · до 18:00» або «Зачинено · відчиниться завтра о 9:00» */
export function openStatus(week: Week, timezone: string, now = new Date()): OpenStatus {
  const { day, minutes } = localNow(timezone, now);
  const today = week[day];
  const yesterday = week[(day + 6) % 7];

  // Нічна зміна з учора, наприклад «Пт 18:00-2:00», а зараз субота 1:00
  for (const s of yesterday ?? []) {
    if (s.close <= s.open && minutes < s.close) {
      return { open: true, text: `Відчинено · до ${formatMinutes(s.close)}` };
    }
  }
  for (const s of today ?? []) {
    if (s.open === 0 && s.close === 24 * 60) return { open: true, text: 'Відчинено цілодобово' };
    const overnight = s.close <= s.open;
    if (minutes >= s.open && (overnight || minutes < s.close)) {
      return { open: true, text: `Відчинено · до ${formatMinutes(s.close)}` };
    }
  }

  // Зачинено — шукаємо, коли відчиниться
  const later = (today ?? []).find((s) => s.open > minutes);
  if (later) return { open: false, text: `Зачинено · відчиниться о ${formatMinutes(later.open)}` };
  for (let k = 1; k <= 7; k++) {
    const d = (day + k) % 7;
    const first = week[d]?.[0];
    if (first) {
      const when = k === 1 ? 'завтра' : DAY_ACCUSATIVE[d];
      return { open: false, text: `Зачинено · відчиниться ${when} о ${formatMinutes(first.open)}` };
    }
  }
  return { open: false, text: 'Зачинено' };
}
