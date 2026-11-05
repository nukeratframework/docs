import {
  docsEnUs,
  metaEnUs,
  docsKoKr,
  metaKoKr,
  docsFaIr,
  metaFaIr,
  docsRu,
  metaRu,
  docsZhCn,
  metaZhCn,
  docsEsEs,
  metaEsEs,
  docsJaJp,
  metaJaJp,
} from '@/.source';
import { DEFAULT_DOCS_LANG, parseDocsLang, type DocsLang } from '@/lib/docs-i18n';
import { useDocsLang } from '@/lib/docs-lang-context';
import { loader } from 'fumadocs-core/source';
import type { TOCItemType } from 'fumadocs-core/server';
import { createMDXSource } from 'fumadocs-mdx';
import { icons } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import { createElement, type ComponentType } from 'react';

export { useDocsLang } from '@/lib/docs-lang-context';

export type DocsPageData = {
  title: string;
  description?: string;
  full?: boolean;
  toc: TOCItemType[];
  body: ComponentType<{ components?: MDXComponents }>;
};

type DocsCollection = {
  docs: typeof docsEnUs;
  meta: typeof metaEnUs;
};

const collections: Record<DocsLang, DocsCollection> = {
  'en-us': { docs: docsEnUs, meta: metaEnUs },
  'ko-kr': { docs: docsKoKr, meta: metaKoKr },
  'fa-ir': { docs: docsFaIr, meta: metaFaIr },
  ru: { docs: docsRu, meta: metaRu },
  'zh-cn': { docs: docsZhCn, meta: metaZhCn },
  'es-es': { docs: docsEsEs, meta: metaEsEs },
  'ja-jp': { docs: docsJaJp, meta: metaJaJp },
};

function createDocsLoader(lang: DocsLang) {
  const { docs, meta } = collections[lang];
  return loader({
    baseUrl: '/docs',
    source: createMDXSource(
      docs as Parameters<typeof createMDXSource>[0],
      meta as NonNullable<Parameters<typeof createMDXSource>[1]>
    ),
    icon(icon) {
      if (!icon) return;
      if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
    },
  });
}

const loaderCache = new Map<DocsLang, ReturnType<typeof createDocsLoader>>();

export function getDocsSource(lang?: string | null) {
  const resolved = parseDocsLang(lang);
  const cached = loaderCache.get(resolved);
  if (cached) return cached;
  const next = createDocsLoader(resolved);
  loaderCache.set(resolved, next);
  return next;
}

/** Default locale source (e.g. build-time helpers). */
export const source = getDocsSource(DEFAULT_DOCS_LANG);

export type PageTree = ReturnType<typeof getDocsSource>['pageTree'];

type PageTreeItem = PageTree['children'][number];
type PageTreeBranch = { children: PageTreeItem[] };
type PageTreePage = Extract<PageTreeItem, { type: 'page' }>;

function flattenTree(tree: PageTreeBranch): PageTreePage[] {
  return tree.children.flatMap((node: PageTreeItem) => {
    if (node.type === 'separator') return [];
    if (node.type === 'folder') {
      const child = flattenTree(node);
      if (node.index) return [node.index, ...child];
      return child;
    }
    return [node];
  });
}

export function findNeighbour(tree: PageTree, url: string) {
  const list = flattenTree(tree);
  for (let i = 0; i < list.length; i++) {
    if (list[i].url === url) {
      return { next: list[i + 1], previous: list[i - 1] };
    }
  }
  return {};
}

export function useDocsPage(slugs: string[]) {
  const { lang } = useDocsLang();
  const docsSource = getDocsSource(lang);
  const page = docsSource.getPage(slugs);
  return { page, slugs, lang, source: docsSource };
}
