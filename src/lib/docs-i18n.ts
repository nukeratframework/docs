import type { To } from 'react-router-dom';

export const DEFAULT_DOCS_LANG = 'en-us';

export const DOCS_LOCALE_ITEMS = [
  { locale: 'en-us', name: 'English (US)' },
  { locale: 'ja-jp', name: '日本語' },
  { locale: 'es-es', name: 'Español' },
  { locale: 'ko-kr', name: '한국어' },
  { locale: 'fa-ir', name: 'فارسی' },
  { locale: 'ru', name: 'Русский' },
  { locale: 'zh-cn', name: '简体中文' },
] as const;

export type DocsLang = (typeof DOCS_LOCALE_ITEMS)[number]['locale'];

const VALID_LANGS = new Set<string>(DOCS_LOCALE_ITEMS.map((item) => item.locale));

export const DOCS_LANG_STORAGE_KEY = 'nukerat-docs-lang';

export function readStoredDocsLang(): DocsLang | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(DOCS_LANG_STORAGE_KEY);
    if (raw && VALID_LANGS.has(raw)) return raw as DocsLang;
  } catch {
    /* private mode / blocked storage */
  }
  return null;
}

export function writeStoredDocsLang(lang: DocsLang): void {
  if (typeof window === 'undefined') return;
  try {
    if (lang === DEFAULT_DOCS_LANG) localStorage.removeItem(DOCS_LANG_STORAGE_KEY);
    else localStorage.setItem(DOCS_LANG_STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}

export function parseDocsLang(value: string | null | undefined): DocsLang {
  if (value && VALID_LANGS.has(value)) return value as DocsLang;
  return DEFAULT_DOCS_LANG;
}

/** URL `lang` wins when valid; otherwise localStorage; otherwise default. */
export function resolveDocsLang(urlLang: string | null | undefined): DocsLang {
  if (urlLang && VALID_LANGS.has(urlLang)) return urlLang as DocsLang;
  return readStoredDocsLang() ?? DEFAULT_DOCS_LANG;
}

export function isInternalDocsHref(href: string) {
  const path = href.split('#')[0]?.split('?')[0] ?? href;
  return path === '/docs' || path.startsWith('/docs/');
}

/** Pathname + hash from an internal docs href (ignores any query on href). */
export function splitDocsHref(href: string): { pathname: string; hash: string } {
  const hashIdx = href.indexOf('#');
  const pathOnly = hashIdx === -1 ? href : href.slice(0, hashIdx);
  const hash = hashIdx === -1 ? '' : href.slice(hashIdx);
  const pathname = pathOnly.split('?')[0] ?? pathOnly;
  return { pathname, hash };
}

/** Preserve the current docs search string (e.g. `?lang=ru`) when navigating inside /docs. */
export function docsTo(href: string, currentSearch: string): To {
  const { pathname, hash } = splitDocsHref(href);
  return { pathname, search: currentSearch, hash };
}

/** Build search string with a single canonical `lang` param (merges other query keys from currentSearch). */
export function docsSearchFromLang(lang: DocsLang, currentSearch = ''): string {
  const params = new URLSearchParams(
    currentSearch.startsWith('?') ? currentSearch.slice(1) : currentSearch
  );
  if (lang === DEFAULT_DOCS_LANG) params.delete('lang');
  else params.set('lang', lang);
  const query = params.toString();
  return query ? `?${query}` : '';
}

export function docsSearchForLang(lang: DocsLang): string {
  return docsSearchFromLang(lang, '');
}

/** @deprecated Prefer docsTo(href, location.search) so the URL query is not rebuilt on every link. */
export function withDocsLang(path: string, lang: DocsLang): string {
  const { pathname, hash } = splitDocsHref(path);
  return `${pathname}${docsSearchForLang(lang)}${hash}`;
}
