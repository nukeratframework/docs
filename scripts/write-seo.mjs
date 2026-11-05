import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mdxRoot = path.join(root, 'src/pages/docs/mdx');
const dataFile = path.join(root, 'src/generated/seo-pages.json');
const site = 'https://nukerat.com';

const langs = [
  { code: 'en-us', hreflang: 'en' },
  { code: 'ja-jp', hreflang: 'ja' },
  { code: 'es-es', hreflang: 'es' },
  { code: 'ko-kr', hreflang: 'ko' },
  { code: 'fa-ir', hreflang: 'fa' },
  { code: 'ru', hreflang: 'ru' },
  { code: 'zh-cn', hreflang: 'zh-CN' },
];

const home = {
  title: 'NukeRat Framework | Post Exploitation for Red Teams',
  description:
    'Open source post exploitation framework for red team operations. Docs cover implants, listeners, pivoting, the armory, and the operator client.',
  h1: 'NukeRat Framework',
  lead: 'A post exploitation framework for modern red team operations.',
};

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

function plain(body) {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, ' ')
    .replace(/^#{1,6}\s+(.*)$/gm, '$1. ')
    .replace(/<[^>]*?(["'])[\s\S]*?\1[^>]*>|<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function summarize(body) {
  let text = plain(body);
  const blurbs = [...body.matchAll(/\bdescription="([^"]+)"/g)].map((match) => match[1]);
  if (blurbs.length && (text.length < 80 || text.includes('[&') || text.includes(']:'))) {
    let combined = '';
    for (const blurb of blurbs) {
      const next = combined ? `${combined} ${blurb}` : blurb;
      if (next.length > 160) break;
      combined = next;
    }
    if (combined) return combined;
  }
  if (!text) return '';
  const sentences = text.match(/[\s\S]*?[.!?](?=\s+[A-Z0-9]|\s*$)/g) ?? [];
  const good = sentences.map((sentence) => sentence.trim()).find((sentence) => sentence.length >= 40 && sentence.length <= 160);
  if (good) return good;
  if (text.length <= 160) return text.trim();
  const cut = text.slice(0, 157);
  const word = cut.lastIndexOf(' ');
  return `${cut.slice(0, word > 40 ? word : 157).trim()}…`;
}

function parseMdx(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const fm = match?.[1] ?? '';
  const body = match?.[2] ?? raw;
  const read = (key) =>
    fm
      .match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]
      ?.trim()
      .replace(/^['"]|['"]$/g, '') ?? '';
  const title = read('title') || 'NukeRat';
  const description = read('description') || summarize(body) || `${title} in the NukeRat documentation.`;
  return { title, description };
}

function routeFromFile(file, lang) {
  const rel = path.relative(path.join(mdxRoot, lang), file).replace(/\\/g, '/');
  const withoutExt = rel.replace(/\.mdx$/, '');
  if (withoutExt === 'index') return '/docs';
  return `/docs/${withoutExt.replace(/\/index$/, '')}`;
}

function collect() {
  /** @type {Record<string, Record<string, { title: string, description: string }>>} */
  const pages = {};
  for (const lang of langs) {
    const dir = path.join(mdxRoot, lang.code);
    if (!fs.existsSync(dir)) continue;
    for (const file of walk(dir)) {
      const route = routeFromFile(file, lang.code);
      const page = parseMdx(fs.readFileSync(file, 'utf8'));
      pages[route] ??= {};
      pages[route][lang.code] = page;
    }
  }
  return pages;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function metaTitle(route, title) {
  if (route === '/docs') return 'NukeRat Documentation';
  return `${title} | NukeRat Docs`;
}

function pageUrl(route, lang) {
  if (lang === 'en-us') return `${site}${route}`;
  return `${site}${route}?lang=${lang}`;
}

function replaceMeta(html, attr, key, content) {
  const pattern = new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function jsonLd(route, entry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: entry.title,
    description: entry.description,
    inLanguage: 'en',
    url: pageUrl(route, 'en-us'),
    isPartOf: {
      '@type': 'WebSite',
      name: 'NukeRat Framework',
      url: `${site}/`,
    },
  };
}

function renderHtml(template, route, pages) {
  const entry = pages[route]['en-us'];
  const title = metaTitle(route, entry.title);
  const canonical = pageUrl(route, 'en-us');
  const alternates = langs
    .filter((lang) => pages[route][lang.code])
    .map(
      (lang) =>
        `    <link rel="alternate" hreflang="${lang.hreflang}" href="${pageUrl(route, lang.code)}" />`
    );
  alternates.push(`    <link rel="alternate" hreflang="x-default" href="${canonical}" />`);
  const ld = JSON.stringify(jsonLd(route, entry)).replaceAll('<', '\\u003c');
  const crawl = `<main><h1>${escapeHtml(entry.title)}</h1><p>${escapeHtml(entry.description)}</p></main>`;

  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, 'name', 'description', entry.description);
  html = replaceMeta(html, 'property', 'og:type', 'article');
  html = replaceMeta(html, 'property', 'og:title', title);
  html = replaceMeta(html, 'property', 'og:description', entry.description);
  html = replaceMeta(html, 'property', 'og:url', canonical);
  html = replaceMeta(html, 'name', 'twitter:title', title);
  html = replaceMeta(html, 'name', 'twitter:description', entry.description);
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" />`
  );
  html = html.replace(
    /<!-- seo:alternates -->[\s\S]*?<!-- \/seo:alternates -->/,
    `<!-- seo:alternates -->\n${alternates.join('\n')}\n    <!-- /seo:alternates -->`
  );
  html = html.replace(
    /<script type="application\/ld\+json" id="seo-jsonld">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="seo-jsonld">${ld}</script>`
  );
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${crawl}</div>`);
  return html;
}

function writeData(pages) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, `${JSON.stringify(pages, null, 2)}\n`);
}

function writeHtml(pages) {
  const indexPath = path.join(root, 'dist/index.html');
  const template = fs.readFileSync(indexPath, 'utf8');
  for (const route of Object.keys(pages)) {
    if (!pages[route]['en-us']) continue;
    const dir =
      route === '/docs' ? path.join(root, 'dist/docs') : path.join(root, 'dist', route.slice(1));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderHtml(template, route, pages));
  }

  const urls = [`${site}/`];
  for (const route of Object.keys(pages).sort()) {
    for (const lang of langs) {
      if (pages[route][lang.code]) urls.push(pageUrl(route, lang.code));
    }
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(root, 'dist/sitemap.xml'), sitemap);
  fs.writeFileSync(
    path.join(root, 'dist/robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`
  );
}

const pages = collect();
const mode = process.argv[2] ?? '--data';
if (mode === '--html') writeHtml(pages);
else writeData(pages);
console.log(`seo ${mode}: ${Object.keys(pages).length} documentation routes`);
