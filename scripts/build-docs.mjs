import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const [markdown, template, css] = await Promise.all([
  readFile(path.join(root, 'docs/memoria.md'), 'utf8'),
  readFile(path.join(root, 'docs/memoria.template.html'), 'utf8'),
  readFile(path.join(root, 'docs/memoria.css'), 'utf8'),
]);

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

marked.setOptions({ gfm: true, breaks: false });

let content = marked.parse(markdown);

content = content.replace(
  /<p><img src="([^"]+)" alt="([^"]*)"\s*\/?><\/p>/g,
  (_, src, alt) => {
    const safeSrc = escapeHtml(src);
    const safeAlt = escapeHtml(alt);

    if (!src.startsWith('capturas/')) {
      return `<figure class="figura"><img src="${safeSrc}" alt="${safeAlt}"><figcaption>${safeAlt}</figcaption></figure>`;
    }

    return `<figure class="captura">
  <div class="marco">
    <div class="pendiente"><span>📸 Captura pendiente</span><small>Guardar como ${safeSrc}</small></div>
    <img src="${safeSrc}" alt="${safeAlt}" onerror="this.style.display='none'">
  </div>
  <figcaption>${safeAlt}</figcaption>
</figure>`;
  },
);

const html = template
  .replace('/* {{CSS}} */', css)
  .replace('<!-- {{CONTENIDO}} -->', content);

await writeFile(path.join(root, 'docs/memoria.html'), html, 'utf8');
console.log(`docs/memoria.html generado (${(html.length / 1024).toFixed(1)} KB)`);
