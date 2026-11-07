// Horários: 0=domingo ... 6=sábado. Cada turno [abre, fecha] em horas (fecha 24 = meia-noite).
export const HOURS = {
  0: [[12, 16], [18, 22]],
  1: null,
  2: [[18, 23]],
  3: [[18, 23]],
  4: [[18, 23]],
  5: [[18, 24]],
  6: [[12, 16], [18, 24]],
};
export const MAX_GUESTS = 8;
const pad = (n) => String(n).padStart(2, '0');

export function parseDate(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return d.getMonth() === +m[2] - 1 ? d : null;
}

/** Horários de chegada: de 30 em 30 min, última 1h antes de fechar o turno. */
export function slotsFor(dateStr) {
  const d = parseDate(dateStr);
  const shifts = d && HOURS[d.getDay()];
  if (!shifts) return [];
  const out = [];
  for (const [open, close] of shifts) {
    for (let m = open * 60; m <= close * 60 - 60; m += 30) out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  }
  return out;
}

export function isOpenAt(now) {
  const shifts = HOURS[now.getDay()];
  const h = now.getHours() + now.getMinutes() / 60;
  return !!shifts && shifts.some(([a, b]) => h >= a && h < b);
}

export function validate(v, today = new Date()) {
  const e = {};
  const name = (v.name || '').trim();
  if (name.length < 3 || !/\s/.test(name)) e.name = 'Informe nome e sobrenome.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v.email || '').trim())) e.email = 'E-mail inválido.';
  const digits = (v.phone || '').replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 11) e.phone = 'Telefone com DDD, 10 ou 11 dígitos.';
  const d = parseDate(v.date);
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const limit = new Date(t0);
  limit.setDate(limit.getDate() + 60);
  if (!d) e.date = 'Escolha uma data.';
  else if (d < t0) e.date = 'A data já passou.';
  else if (d > limit) e.date = 'Reservas abertas até 60 dias à frente.';
  else if (!HOURS[d.getDay()]) e.date = 'Fechamos às segundas-feiras.';
  if (!e.date && !slotsFor(v.date).includes(v.time)) e.time = 'Escolha um horário disponível.';
  else if (!e.date && d.getTime() === t0.getTime() && v.time <= `${pad(today.getHours())}:${pad(today.getMinutes())}`) e.time = 'Esse horário já passou.';
  const g = Number(v.guests);
  if (!Number.isInteger(g) || g < 1) e.guests = 'Informe o número de pessoas.';
  else if (g > MAX_GUESTS) e.guests = `Para mais de ${MAX_GUESTS} pessoas, fale com a casa.`;
  return e;
}

export function code(v) {
  const s = `${v.date}${v.time}${v.name}`;
  let h = 7;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return 'YG-' + h.toString(36).toUpperCase().slice(0, 5).padEnd(5, '0');
}
