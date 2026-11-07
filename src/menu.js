// Cardápio fictício. tags: veg, sg (sem glúten), pic (picante)
export const CATS = [
  ['entradas', 'Entradas'], ['sushi', 'Sushi e sashimi'], ['robata', 'Robata'],
  ['ramen', 'Ramen e donburi'], ['doces', 'Sobremesas'], ['bebidas', 'Bebidas'],
];
export const TAGS = { veg: 'Vegetariano', sg: 'Sem glúten', pic: 'Picante' };
export const ITEMS = [
  { id: 1, cat: 'entradas', k: '枝', name: 'Edamame com sal defumado', desc: 'Vagens cozidas no vapor, flor de sal defumada.', price: 22, tags: ['veg', 'sg'] },
  { id: 2, cat: 'entradas', k: '餃', name: 'Gyoza de porco e gengibre', desc: 'Seis unidades grelhadas, molho ponzu cítrico.', price: 34, tags: [] },
  { id: 3, cat: 'entradas', k: '茄', name: 'Nasu dengaku', desc: 'Berinjela assada com glacê de missô branco e gergelim.', price: 30, tags: ['veg'] },
  { id: 4, cat: 'entradas', k: '唐', name: 'Karaage de frango', desc: 'Frango marinado em shoyu e gengibre, maionese de yuzu.', price: 38, tags: [] },
  { id: 5, cat: 'sushi', k: '鮪', name: 'Nigiri de atum (2 un.)', desc: 'Atum fresco sobre arroz levemente avinagrado.', price: 36, tags: ['sg'] },
  { id: 6, cat: 'sushi', k: '鮭', name: 'Nigiri de salmão maçaricado', desc: 'Salmão selado, tare doce e cebolinha.', price: 34, tags: [] },
  { id: 7, cat: 'sushi', k: '刺', name: 'Sashimi misto (12 fatias)', desc: 'Atum, salmão e peixe branco do dia.', price: 78, tags: ['sg'] },
  { id: 8, cat: 'sushi', k: '巻', name: 'Uramaki spicy tuna', desc: 'Atum, pepino, maionese picante e tobiko.', price: 44, tags: ['pic'] },
  { id: 9, cat: 'sushi', k: '胡', name: 'Hosomaki de pepino', desc: 'Pepino crocante e gergelim torrado, oito peças.', price: 26, tags: ['veg', 'sg'] },
  { id: 10, cat: 'sushi', k: '宴', name: 'Barca Yūgure (32 peças)', desc: 'Seleção do chef: nigiris, uramakis e sashimis.', price: 189, tags: [] },
  { id: 11, cat: 'robata', k: '串', name: 'Yakitori de coxa', desc: 'Espeto de frango na brasa, tare e shichimi.', price: 18, tags: ['pic'] },
  { id: 12, cat: 'robata', k: '肉', name: 'Wagyu na pedra', desc: 'Cortes finos de fraldinha, sal e wasabi fresco.', price: 98, tags: ['sg'] },
  { id: 13, cat: 'robata', k: '椎', name: 'Shiitake na brasa', desc: 'Cogumelos com manteiga de shoyu e limão.', price: 28, tags: ['veg'] },
  { id: 14, cat: 'robata', k: '鯖', name: 'Cavala shioyaki', desc: 'Filé grelhado com sal marinho e daikon ralado.', price: 58, tags: ['sg'] },
  { id: 15, cat: 'ramen', k: '麺', name: 'Tonkotsu ramen', desc: 'Caldo de porco por 18 horas, chashu, ovo marinado.', price: 52, tags: [] },
  { id: 16, cat: 'ramen', k: '辛', name: 'Tantanmen', desc: 'Caldo de gergelim e pimenta, carne moída, bok choy.', price: 54, tags: ['pic'] },
  { id: 17, cat: 'ramen', k: '野', name: 'Ramen de legumes e missô', desc: 'Caldo de kombu e missô, tofu, milho e nori.', price: 46, tags: ['veg'] },
  { id: 18, cat: 'ramen', k: '丼', name: 'Gyudon', desc: 'Arroz com fatias de carne e cebola ao shoyu doce, ovo.', price: 48, tags: [] },
  { id: 19, cat: 'doces', k: '茶', name: 'Sorvete de chá verde', desc: 'Matchá cerimonial, duas bolas, calda de feijão azuki.', price: 24, tags: ['veg', 'sg'] },
  { id: 20, cat: 'doces', k: '餅', name: 'Mochi de morango (3 un.)', desc: 'Massa de arroz glutinoso recheada de creme e morango.', price: 26, tags: ['veg', 'sg'] },
  { id: 21, cat: 'doces', k: '焼', name: 'Dorayaki de doce de leite', desc: 'Panquecas macias com doce de leite e sal.', price: 22, tags: ['veg'] },
  { id: 22, cat: 'bebidas', k: '酒', name: 'Sake junmai (taça)', desc: 'Seco, notas de arroz e pera. Servido gelado.', price: 32, tags: ['veg', 'sg'] },
  { id: 23, cat: 'bebidas', k: '柚', name: 'Highball de yuzu', desc: 'Whisky japonês, soda e casca de yuzu.', price: 36, tags: ['veg', 'sg'] },
  { id: 24, cat: 'bebidas', k: '緑', name: 'Chá gen-maicha (bule)', desc: 'Chá verde com arroz tostado, para dois.', price: 18, tags: ['veg', 'sg'] },
];

const norm = (s) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

export function filterItems(items, { cat = 'todos', tags = [], q = '' } = {}) {
  const query = norm(q.trim());
  return items.filter((i) =>
    (cat === 'todos' || i.cat === cat) &&
    tags.every((t) => i.tags.includes(t)) &&
    (!query || norm(`${i.name} ${i.desc}`).includes(query)));
}
export const brl = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');
