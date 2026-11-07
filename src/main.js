import { CATS, TAGS, ITEMS, filterItems, brl } from './menu.js';
import { validate, slotsFor, isOpenAt, code, HOURS } from './booking.js';

const $ = (s) => document.querySelector(s);
const el = (tag, props = {}, ...kids) => {
  const n = Object.assign(document.createElement(tag), props);
  n.append(...kids);
  return n;
};
const state = { cat: 'todos', tags: new Set(), q: '' };

// ---- Cardápio
function renderMenu() {
  const list = filterItems(ITEMS, { cat: state.cat, tags: [...state.tags], q: state.q });
  const ul = $('#menu');
  ul.replaceChildren(...list.map((i) => el('li', { className: 'item' },
    el('span', { className: 'k', ariaHidden: 'true', textContent: i.k }),
    el('h3', { textContent: i.name }),
    el('span', { className: 'price', textContent: brl(i.price) }),
    el('p', { textContent: i.desc }),
    i.tags.length ? el('div', { className: 'tg' }, ...i.tags.map((t) => el('span', { className: t, textContent: TAGS[t] }))) : '')));
  $('#count').textContent = `${list.length} ${list.length === 1 ? 'prato' : 'pratos'}`;
  $('#empty').hidden = list.length > 0;
}
function chip(label, pressed, onClick) {
  const b = el('button', { className: 'chip', type: 'button', textContent: label });
  b.setAttribute('aria-pressed', pressed);
  b.addEventListener('click', onClick);
  return b;
}
function renderChips() {
  $('#cats').replaceChildren(...[['todos', 'Todos'], ...CATS].map(([id, l]) =>
    chip(l, state.cat === id, () => { state.cat = id; renderChips(); renderMenu(); })));
  $('#tags').replaceChildren(...Object.entries(TAGS).map(([id, l]) =>
    chip(l, state.tags.has(id), () => { state.tags.has(id) ? state.tags.delete(id) : state.tags.add(id); renderChips(); renderMenu(); })));
}
$('#q').addEventListener('input', (e) => { state.q = e.target.value; renderMenu(); });
$('#clear').addEventListener('click', () => {
  Object.assign(state, { cat: 'todos', tags: new Set(), q: '' });
  $('#q').value = '';
  renderChips(); renderMenu();
});

// ---- Horários
const now = new Date();
const open = isOpenAt(now);
const status = $('#status');
status.textContent = open ? 'Aberto agora' : (HOURS[now.getDay()] ? 'Fechado agora' : 'Fechado hoje (segunda)');
status.classList.toggle('on', open);
const rowDay = now.getDay() >= 2 && now.getDay() <= 4 ? 2 : now.getDay();
document.querySelector(`.hours tr[data-d="${rowDay}"]`)?.classList.add('today');

// ---- Reservas
const form = $('#form');
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dateEl = $('#date');
dateEl.min = iso(now);
const max = new Date(now); max.setDate(max.getDate() + 60);
dateEl.max = iso(max);

function fillTimes() {
  const slots = slotsFor(dateEl.value);
  const sel = $('#time');
  sel.replaceChildren(el('option', { value: '', textContent: dateEl.value ? (slots.length ? 'Escolha' : 'Fechado nesse dia') : 'Escolha a data' }),
    ...slots.map((s) => el('option', { value: s, textContent: s })));
}
dateEl.addEventListener('change', fillTimes);

const FIELDS = ['name', 'email', 'phone', 'date', 'time', 'guests'];
function showErrors(errs) {
  for (const f of FIELDS) {
    $(`#e-${f}`).textContent = errs[f] || '';
    const inp = $(`#${f}`);
    if (errs[f]) { inp.setAttribute('aria-invalid', 'true'); inp.setAttribute('aria-describedby', `e-${f}`); } else inp.removeAttribute('aria-invalid');
  }
}
form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const v = Object.fromEntries(new FormData(form));
  const errs = validate(v);
  showErrors(errs);
  const first = FIELDS.find((f) => errs[f]);
  if (first) return $(`#${first}`).focus();
  const c = code(v);
  try { localStorage.setItem('yugure:ultima-reserva', JSON.stringify({ ...v, code: c })); } catch { /* armazenamento bloqueado: segue sem salvar */ }
  const [y, m, d] = v.date.split('-');
  const box = $('#done');
  box.replaceChildren(
    el('p', { className: 'eyebrow', textContent: '予約完了 · Reserva registrada' }),
    el('h3', { textContent: `Até breve, ${v.name.trim().split(/\s+/)[0]}.` }),
    el('p', { textContent: 'Esta é uma demonstração: nada foi enviado. Em um restaurante real, você receberia a confirmação por e-mail.' }),
    el('dl', {}, el('dt', { textContent: 'Data' }), el('dd', { textContent: `${d}/${m}/${y}, ${v.time}` }),
      el('dt', { textContent: 'Pessoas' }), el('dd', { textContent: v.guests }),
      el('dt', { textContent: 'Código' }), el('dd', { className: 'cod', textContent: c })),
    el('button', { className: 'btn ghost', type: 'button', textContent: 'Nova reserva', onclick: () => { box.hidden = true; $('#how').hidden = false; form.hidden = false; form.reset(); fillTimes(); $('#name').focus(); } }));
  form.hidden = true;
  $('#how').hidden = true;
  box.hidden = false;
  box.focus();
});
form.addEventListener('input', (e) => {
  if (e.target.id in { name: 1, email: 1, phone: 1, guests: 1 } && e.target.getAttribute('aria-invalid')) {
    const errs = validate(Object.fromEntries(new FormData(form)));
    $(`#e-${e.target.id}`).textContent = errs[e.target.id] || '';
    if (!errs[e.target.id]) e.target.removeAttribute('aria-invalid');
  }
});

renderChips();
renderMenu();
fillTimes();
