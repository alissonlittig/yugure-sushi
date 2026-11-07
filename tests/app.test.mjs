import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate, slotsFor, isOpenAt, code } from '../src/booking.js';
import { ITEMS, filterItems } from '../src/menu.js';

const today = new Date(2026, 10, 6, 15, 0); // sex 06/11/2026
const ok = { name: 'Ana Souza', email: 'ana@exemplo.com', phone: '(41) 99999-0000', date: '2026-11-07', time: '20:00', guests: 2 };

test('reserva válida não tem erros', () => assert.deepEqual(validate(ok, today), {}));
test('segunda fechada', () => assert.ok(validate({ ...ok, date: '2026-11-09' }, today).date));
test('data passada e longe demais', () => {
  assert.ok(validate({ ...ok, date: '2026-11-05' }, today).date);
  assert.ok(validate({ ...ok, date: '2027-03-01' }, today).date);
});
test('horário fora do turno e mais de 8 pessoas', () => {
  assert.ok(validate({ ...ok, time: '17:00' }, today).time);
  assert.ok(validate({ ...ok, guests: 9 }, today).guests);
});
test('hoje: horário já passado é recusado', () => {
  assert.ok(validate({ ...ok, date: '2026-11-06', time: '15:00' }, today).time);
  assert.deepEqual(validate({ ...ok, date: '2026-11-06', time: '20:00' }, today), {});
});
test('campos inválidos', () => {
  const e = validate({ name: 'Ana', email: 'x', phone: '123', date: '', time: '', guests: 0 }, today);
  for (const k of ['name', 'email', 'phone', 'date', 'guests']) assert.ok(e[k], k);
});
test('slots', () => {
  assert.equal(slotsFor('2026-11-09').length, 0);
  assert.deepEqual(slotsFor('2026-11-10'), ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00']);
  assert.equal(slotsFor('2026-11-07').at(-1), '23:00');
});
test('aberto agora', () => {
  assert.equal(isOpenAt(new Date(2026, 10, 9, 20)), false);
  assert.equal(isOpenAt(new Date(2026, 10, 10, 20)), true);
});
test('código estável', () => assert.equal(code(ok), code(ok)));
test('filtros do cardápio', () => {
  assert.ok(filterItems(ITEMS, { cat: 'ramen' }).every((i) => i.cat === 'ramen'));
  assert.ok(filterItems(ITEMS, { tags: ['veg', 'sg'] }).every((i) => i.tags.includes('veg') && i.tags.includes('sg')));
  assert.equal(filterItems(ITEMS, { q: 'BERINJELA' }).length, 1);
  assert.ok(filterItems(ITEMS, { q: 'cha verde' }).length >= 1);
});
