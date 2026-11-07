import { cpSync, rmSync, mkdirSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
for (const f of ['index.html', 'styles.css', 'src']) cpSync(f, `dist/${f}`, { recursive: true });
console.log('dist/ pronto');
