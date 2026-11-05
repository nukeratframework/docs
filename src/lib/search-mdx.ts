import { createRequire } from 'node:module';
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createFromSource } from 'fumadocs-core/search/server';

const require = createRequire(import.meta.url);
const loader = require('fumadocs-mdx/loader-mdx') as (
  this: LoaderContext,
  source: string
) => void;

type LoaderContext = {
  resourcePath: string;
  resourceQuery: string;
  context: string;
  mode: 'production';
  cacheable: () => void;
  getOptions: () => { _ctx: { configPath: string } };
  async: () => (error: Error | null | undefined, code?: string) => void;
};

const root = path.resolve(import.meta.dirname, '../..');
const docsDir = path.join(root, 'src/pages/docs/mdx/en-us');
const configPath = path.join(root, 'source.config.ts');

function walk(dir: string, files: string[] = []) {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) walk(file, files);
    else if (name.endsWith('.mdx')) files.push(file);
  }
  return files;
}

function compile(file: string) {
  return new Promise<string>((resolve, reject) => {
    const context: LoaderContext = {
      resourcePath: file,
      resourceQuery: '',
      context: path.dirname(file),
      mode: 'production',
      cacheable: () => {},
      getOptions: () => ({ _ctx: { configPath } }),
      async: () => (error, code) => (error ? reject(error) : resolve(code ?? '')),
    };
    loader.call(context, readFileSync(file, 'utf8'));
  });
}

function readExport(code: string, name: string) {
  const marker = `export let ${name} = `;
  const start = code.indexOf(marker);
  if (start < 0) throw new Error(`Missing export ${name}`);
  const expr = sliceExpression(code, start + marker.length);
  return new Function(`return (${expr})`)();
}

function sliceExpression(code: string, from: number) {
  let i = from;
  while (code[i] === ' ' || code[i] === '\n' || code[i] === '\r') i++;
  const open = code[i];
  if (open !== '{' && open !== '[') {
    const end = code.indexOf(';', i);
    return code.slice(i, end === -1 ? undefined : end);
  }

  const stack = [open === '{' ? '}' : ']'];
  i += 1;
  let quote: string | null = null;
  while (i < code.length && stack.length > 0) {
    const char = code[i];
    if (quote) {
      if (char === '\\') {
        i += 2;
        continue;
      }
      if (char === quote) quote = null;
      i += 1;
      continue;
    }
    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      i += 1;
      continue;
    }
    if (char === '{' || char === '[') stack.push(char === '{' ? '}' : ']');
    else if (char === '}' || char === ']') stack.pop();
    i += 1;
  }
  return code.slice(from, i);
}

function pageUrl(file: string) {
  const slugRaw = path
    .relative(docsDir, file)
    .replace(/\.mdx$/, '')
    .replace(/\\/g, '/')
    .replace(/\/index$/, '');
  const slug = slugRaw === 'index' ? '' : slugRaw;
  return slug ? `/docs/${slug}` : '/docs';
}

type IndexedPage = {
  url: string;
  data: {
    title: string;
    description?: string;
    structuredData: unknown;
  };
};

export async function buildSearch() {
  const pages: IndexedPage[] = [];
  for (const file of walk(docsDir)) {
    const code = await compile(file);
    const frontmatter = readExport(code, 'frontmatter') as { title: string; description?: string };
    const structuredData = readExport(code, 'structuredData');
    const url = pageUrl(file);
    pages.push({
      url,
      data: {
        title: frontmatter.title,
        description: frontmatter.description,
        structuredData,
      },
    });
  }

  const json = await createFromSource({
    getPages: () => pages,
  } as unknown as Parameters<typeof createFromSource>[0]).export();
  const outDir = path.join(root, 'public/api');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, 'search'), JSON.stringify(json));
}

await buildSearch();
