import {
  findNeighbour,
  getDocsSource,
  useDocsPage,
  type DocsPageData,
} from '@/lib/source';
import { docsTo, type DocsLang } from '@/lib/docs-i18n';
import { DocsLangProvider, useDocsLang } from '@/lib/docs-lang-context';
import { DocsLink } from '@/ui/docs-link';
import { useMDXComponents } from '@/mdx-components';
import { Button } from '@/ui/button';
import { SkipNavigationButton } from '@/ui/skip-navigation-button';
import { DocsLanguageSelect } from '@/ui/custom/docs-language-select';
import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/notebook';
import {
  DocsBody,
  DocsDescription,
  DocsPage as DocsPageLayout,
  DocsTitle,
} from 'fumadocs-ui/page';
import { ArrowLeftIcon, ArrowRightIcon, Github } from 'lucide-react';
import { useEffect, type ComponentType, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import type { LinkItemType } from 'fumadocs-ui/layouts/docs';
import NRicon from '/images/logo.svg';

/** fumadocs notebook `.d.ts` imports `BaseLayoutProps` from a missing path, so exported props omit `children` and nav options. */
type NotebookLayoutProps = DocsLayoutProps & {
  children?: ReactNode;
  disableThemeSwitch?: boolean;
  i18n?: boolean;
  githubUrl?: string;
  links?: LinkItemType[];
  nav?: {
    title?: ReactNode;
    url?: string;
    children?: ReactNode;
  };
};

const NotebookDocsLayout = DocsLayout as ComponentType<NotebookLayoutProps>;

function DocsFooter({ url, lang }: { url: string; lang: DocsLang }) {
  const docsSource = getDocsSource(lang);
  const neighbours = findNeighbour(docsSource.pageTree, url);
  const isManualInstallation = url === '/docs/installation/manual';

  return (
    <footer>
      <div className="flex h-16 w-full items-center justify-between gap-2">
        {neighbours.previous || isManualInstallation ? (
          <Button variant="ghost" size="sm" asChild className="bg-fd-accent hover:bg-fd-accent/80">
            <DocsLink to={neighbours.previous?.url || '/docs'}>
              <ArrowLeftIcon />
              {neighbours.previous?.name || 'Introduction'}
            </DocsLink>
          </Button>
        ) : (
          <div />
        )}
        {neighbours.next || isManualInstallation ? (
          <Button variant="ghost" size="sm" asChild className="bg-fd-accent hover:bg-fd-accent/80">
            <DocsLink to={neighbours.next?.url || '/docs/fast-setup'}>
              {neighbours.next?.name || 'Fast setup'}
              <ArrowRightIcon />
            </DocsLink>
          </Button>
        ) : null}
      </div>
    </footer>
  );
}

function NeighbourButtons({ url, lang }: { url: string; lang: DocsLang }) {
  const docsSource = getDocsSource(lang);
  const neighbours = findNeighbour(docsSource.pageTree, url);
  const isManualInstallation = url === '/docs/installation/manual';

  return (
    <div className="flex items-center gap-2">
      {neighbours.previous || isManualInstallation ? (
        <Button variant="outline" size="icon" className="border-border/70 size-8" asChild>
          <DocsLink to={neighbours.previous?.url || '/docs'}>
            <ArrowLeftIcon />
          </DocsLink>
        </Button>
      ) : null}
      {neighbours.next || isManualInstallation ? (
        <Button variant="outline" size="icon" className="border-border/70 size-8" asChild>
          <DocsLink to={neighbours.next?.url || '/docs/fast-setup'}>
            <ArrowRightIcon />
          </DocsLink>
        </Button>
      ) : null}
    </div>
  );
}

export function DocsLayoutRoute() {
  return (
    <DocsLangProvider>
      <DocsLayoutShell />
    </DocsLangProvider>
  );
}

function DocsLayoutShell() {
  const { lang, setLang } = useDocsLang();
  const docsSource = getDocsSource(lang);
  const htmlLang =
    lang === 'ru'
      ? 'ru'
      : lang === 'zh-cn'
        ? 'zh-CN'
        : lang === 'ko-kr'
          ? 'ko'
          : lang === 'es-es'
            ? 'es'
            : lang === 'ja-jp'
              ? 'ja'
              : lang.startsWith('pt')
              ? 'pt'
              : 'en';

  const navLinks: LinkItemType[] = [
    {
      type: 'custom',
      children: (
        <div className="flex flex-col gap-3 px-2 py-3 lg:hidden">
          <DocsLanguageSelect value={lang} onValueChange={setLang} triggerClassName="w-full" />
          <Button variant="outline" size="sm" className="w-full justify-center gap-2" asChild>
            <a
              href="https://github.com/nukeratframework/nukerat"
              target="_blank"
              rel="noreferrer noopener">
              <Github className="size-4" />
              GitHub
            </a>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div lang={htmlLang}>
      <SkipNavigationButton />
      <NotebookDocsLayout
        disableThemeSwitch
        tree={docsSource.pageTree}
        links={navLinks}
        containerProps={{
          className:
            '[&_[data-theme-toggle]]:hidden [&_#nd-sidebar_.docs-topbar-actions]:hidden',
        }}
        nav={{
          title: (
            <div className="text-foreground/80 -ml-px flex items-center gap-1.5 opacity-90 transition-opacity duration-200 hover:opacity-100">
              <div className="mb-1 mr-[1px] flex items-center justify-center">
                <img src={NRicon} alt="NukeRat Framework" className="h-[19px] w-[19px]" />
              </div>
              <p className="text-base font-semibold tracking-wide">NukeRat</p>
            </div>
          ),
          children: (
            <div className="docs-topbar-actions ms-auto flex items-center gap-1.5 max-lg:hidden">
              <DocsLanguageSelect value={lang} onValueChange={setLang} />
              <Button variant="ghost" size="icon" className="text-fd-muted-foreground size-9" asChild>
                <a
                  href="https://github.com/nukeratframework/nukerat"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="GitHub">
                  <Github className="size-5" />
                </a>
              </Button>
            </div>
          ),
        }}
        sidebar={{ className: '[&>div]:pt-3' }}>
        <Outlet />
      </NotebookDocsLayout>
    </div>
  );
}

export function DocsPage() {
  const { '*': slug } = useParams();
  const location = useLocation();
  const slugs = slug ? slug.split('/').filter(Boolean) : [];
  const { page, lang } = useDocsPage(slugs);
  const { docsSearch } = useDocsLang();

  useEffect(() => {
    if (!page) return;
    const id = location.hash.slice(1);
    if (!id) return;
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 0);
    return () => window.clearTimeout(timer);
  }, [page, location.pathname]);

  if (!page) return <Navigate to={docsTo('/docs', docsSearch)} replace />;

  const data = page.data as unknown as DocsPageData;
  const MDX = data.body;
  const components = useMDXComponents();

  return (
    <DocsPageLayout
      toc={data.toc}
      full={data.full}
      breadcrumb={{ enabled: false }}
      footer={{ component: <DocsFooter url={page.url} lang={lang} /> }}>
      <DocsBody>
        <div className="flex items-center justify-between gap-2">
          <DocsTitle className="mb-0 font-semibold">{data.title}</DocsTitle>
          <NeighbourButtons url={page.url} lang={lang} />
        </div>
        <DocsDescription className="mb-4 mt-2.5 text-base text-[#cecece]">
          {data.description}
        </DocsDescription>
        <MDX components={components} />
      </DocsBody>
    </DocsPageLayout>
  );
}
