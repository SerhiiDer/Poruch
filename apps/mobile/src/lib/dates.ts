// Допоміжні функції для дат івентів (українською).

export function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString('uk-UA', { weekday: 'short', day: 'numeric', month: 'long' });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
}

/** Число і скорочений місяць окремо — для «календарика» на картці */
export function dateParts(iso: string) {
  const d = new Date(iso);
  return {
    day: String(d.getDate()),
    month: d.toLocaleDateString('uk-UA', { month: 'short' }).replace('.', ''),
    weekday: d.toLocaleDateString('uk-UA', { weekday: 'short' }),
  };
}

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function isToday(iso: string) {
  return startOfDay(new Date(iso)).getTime() === startOfDay(new Date()).getTime();
}

/** Найближчі субота і неділя (або сьогоднішні, якщо вже вихідні) */
export function isThisWeekend(iso: string) {
  const now = startOfDay(new Date());
  const dow = now.getDay(); // 0 — неділя, 6 — субота
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + (dow === 0 ? -1 : 6 - dow));
  const mondayAfter = new Date(saturday);
  mondayAfter.setDate(saturday.getDate() + 2);
  const t = new Date(iso).getTime();
  return t >= saturday.getTime() && t < mondayAfter.getTime();
}

export function isWithinDays(iso: string, days: number) {
  const t = new Date(iso).getTime();
  const start = startOfDay(new Date()).getTime();
  return t >= start && t < start + days * 24 * 60 * 60 * 1000;
}

/** Заголовок групи в списку івентів: «Сьогодні», «Завтра» або дата */
export function dayGroupLabel(iso: string) {
  const diff = Math.round(
    (startOfDay(new Date(iso)).getTime() - startOfDay(new Date()).getTime()) / (24 * 60 * 60 * 1000),
  );
  if (diff === 0) return 'Сьогодні';
  if (diff === 1) return 'Завтра';
  const label = formatDay(iso);
  return label.charAt(0).toUpperCase() + label.slice(1);
}
