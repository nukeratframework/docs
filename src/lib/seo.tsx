import pages from '@/generated/seo-pages.json';
import { parseDocsLang, type DocsLang } from '@/lib/docs-i18n';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE = 'https://nukerat.com';

const HOME_TITLE = 'NukeRat Framework | Post Exploitation for Red Teams';
const HOME_DESCRIPTION =
  'Open source post exploitation framework for red team operations. Docs cover implants, listeners, pivoting, the armory, and the operator client.';

const HTML_LANG: Record<DocsLang, string> = {
  'en-us': 'en',
  'ja-jp': 'ja',
  'es-es': 'es',
  'ko-kr': 'ko',
  'fa-ir': 'fa',
  ru: 'ru',
  'zh-cn': 'zh-CN',
};

type SeoEntry = { title: string; description: string };
type SeoPages = Record<string, Partial<Record<DocsLang, SeoEntry>>>;

const seoPages = pages as SeoPages;

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let tag = document.head.querySelector<HTMLLinkElement>(selector);
  if (!tag) {
    tag = document.createElement('link');
    tag.rel = rel;
    if (hreflang) tag.hreflang = hreflang;
    document.head.appendChild(tag);
  }
  tag.href = href;
}

function applySeo(options: {
  title: string;
  description: string;
  canonical: string;
  lang: string;
  type: 'website' | 'article';
  jsonLd: Record<string, unknown>;
}) {
  document.title = options.title;
  document.documentElement.lang = options.lang;
  upsertMeta('name', 'description', options.description);
  upsertMeta('property', 'og:type', options.type);
  upsertMeta('property', 'og:site_name', 'NukeRat Framework');
  upsertMeta('property', 'og:title', options.title);
  upsertMeta('property', 'og:description', options.description);
  upsertMeta('property', 'og:url', options.canonical);
  upsertMeta('name', 'twitter:card', 'summary');
  upsertMeta('name', 'twitter:title', options.title);
  upsertMeta('name', 'twitter:description', options.description);
  upsertLink('canonical', options.canonical);

  let script = document.getElementById('seo-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'seo-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(options.jsonLd);
}

export function Seo() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const route = pathname.replace(/\/+$/, '') || '/';
    const lang = parseDocsLang(new URLSearchParams(search).get('lang'));
    document.head.querySelectorAll('link[rel="alternate"]').forEach((tag) => tag.remove());

    if (route === '/') {
      applySeo({
        title: HOME_TITLE,
        description: HOME_DESCRIPTION,
        canonical: `${SITE}/`,
        lang: 'en',
        type: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'NukeRat Framework',
          applicationCategory: 'SecurityApplication',
          operatingSystem: 'Linux, macOS, Windows',
          description: HOME_DESCRIPTION,
          url: `${SITE}/`,
        },
      });
      return;
    }

    const localized = seoPages[route]?.[lang] ?? seoPages[route]?.['en-us'];
    if (!localized) return;

    const canonical = lang === 'en-us' ? `${SITE}${route}` : `${SITE}${route}?lang=${lang}`;
    const title = route === '/docs' ? 'NukeRat Documentation' : `${localized.title} | NukeRat Docs`;
    const alternates = seoPages[route] ?? {};
    for (const [code, entry] of Object.entries(alternates)) {
      if (!entry) continue;
      const docsLang = code as DocsLang;
      upsertLink(
        'alternate',
        docsLang === 'en-us' ? `${SITE}${route}` : `${SITE}${route}?lang=${docsLang}`,
        HTML_LANG[docsLang]
      );
    }
    upsertLink('alternate', `${SITE}${route}`, 'x-default');

    applySeo({
      title,
      description: localized.description,
      canonical,
      lang: HTML_LANG[lang],
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: localized.title,
        description: localized.description,
        inLanguage: HTML_LANG[lang],
        url: canonical,
        isPartOf: {
          '@type': 'WebSite',
          name: 'NukeRat Framework',
          url: `${SITE}/`,
        },
      },
    });
  }, [pathname, search]);

  return null;
}
