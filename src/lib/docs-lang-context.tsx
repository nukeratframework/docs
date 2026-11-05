import {
  DEFAULT_DOCS_LANG,
  docsSearchFromLang,
  parseDocsLang,
  readStoredDocsLang,
  resolveDocsLang,
  writeStoredDocsLang,
  type DocsLang,
} from '@/lib/docs-i18n';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

type DocsLangContextValue = {
  lang: DocsLang;
  setLang: (locale: string) => void;
  /** Query string for internal doc links, including `lang` when not default. */
  docsSearch: string;
};

const DocsLangContext = createContext<DocsLangContextValue | null>(null);

export function DocsLangProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const lang = useMemo(
    () => resolveDocsLang(searchParams.get('lang')),
    [searchParams]
  );

  const docsSearch = useMemo(
    () => docsSearchFromLang(lang, location.search),
    [lang, location.search]
  );

  useEffect(() => {
    writeStoredDocsLang(lang);

    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        const urlLang = params.get('lang');

        if (lang !== DEFAULT_DOCS_LANG && urlLang !== lang) {
          params.set('lang', lang);
          return params;
        }
        if (lang === DEFAULT_DOCS_LANG && urlLang) {
          params.delete('lang');
          return params;
        }
        return prev;
      },
      { replace: true }
    );
  }, [lang, location.pathname, setSearchParams]);

  const setLang = useCallback(
    (nextLang: string) => {
      const resolved = parseDocsLang(nextLang);
      writeStoredDocsLang(resolved);
      const params = new URLSearchParams(searchParams);
      if (resolved === DEFAULT_DOCS_LANG) params.delete('lang');
      else params.set('lang', resolved);
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const value = useMemo(
    () => ({ lang, setLang, docsSearch }),
    [lang, setLang, docsSearch]
  );

  return <DocsLangContext.Provider value={value}>{children}</DocsLangContext.Provider>;
}

export function useOptionalDocsLang(): DocsLangContextValue | null {
  return useContext(DocsLangContext);
}

export function useDocsLang(): DocsLangContextValue {
  const ctx = useOptionalDocsLang();
  if (!ctx) {
    throw new Error('useDocsLang must be used within DocsLangProvider');
  }
  return ctx;
}

/** Resolve lang outside React (e.g. router push before provider tree). */
export function getDocsLangForNavigation(currentSearch: string): DocsLang {
  const params = new URLSearchParams(
    currentSearch.startsWith('?') ? currentSearch.slice(1) : currentSearch
  );
  return resolveDocsLang(params.get('lang'));
}

export function getDocsSearchForNavigation(currentSearch: string): string {
  const lang = getDocsLangForNavigation(currentSearch);
  return docsSearchFromLang(lang, currentSearch);
}
