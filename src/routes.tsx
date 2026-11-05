import { Seo } from '@/lib/seo';
import Home from '@/pages/home';
import { DocsLoading } from '@/pages/docs/docs-loading';
import { SafeAreaProvider } from '@/ui/safe-area-provider';
import type { SearchLink } from 'fumadocs-ui/components/dialog/search';
import { RootProvider } from 'fumadocs-ui/provider';
import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom';


const search = {
  options: { type: 'static' as const, api: '/api/search' },
  links: [
    ['Home', '/docs'],
    ['Introduction', '/docs/introduction'],
    ['Installation', '/docs/installation'],
    ['Fast setup', '/docs/fast-setup'],
    ['Interface', '/docs/interface'],
    ['Terminal', '/docs/interface/terminal'],
    ['Folder explorer', '/docs/interface/folder-explorer'],
    ['Processes', '/docs/interface/processes'],
    ['Screenshot', '/docs/interface/screenshot'],
    ['Keylogger', '/docs/interface/keylogger'],
    ['Credentials', '/docs/interface/credentials'],
    ['Hosts', '/docs/interface/hosts'],
    ['Attack graphs', '/docs/interface/attack-graphs'],
    ['AI Agent', '/docs/interface/ai-agent'],
    ['File server', '/docs/interface/file-server'],
    ['Listeners', '/docs/listeners'],
    ['AI agents', '/docs/agents'],
    ['Servers', '/docs/servers'],
    ['Configuration', '/docs/servers/configuration'],
    ['Armory', '/docs/armory'],
    ['NukeScript', '/docs/nukescripts'],
    ['Events', '/docs/nukescripts/events'],
    ['Commands', '/docs/nukescripts/commands'],
    ['Examples', '/docs/nukescripts/examples'],
    ['Pivoting', '/docs/pivoting'],
    ['Reports', '/docs/reports'],
    ['Monitoring', '/docs/monitoring'],
    ['Operator key', '/docs/operator-key'],
    ['Rest API', '/docs/rest-api'],
    ['Custom implants', '/docs/custom-implants'],
    ['Custom channels', '/docs/custom-channels'],
    ['Implants', '/docs/client/implants'],
    ['Creation', '/docs/client/implants/creation'],
    ['Advanced', '/docs/client/implants/advanced'],
  ] satisfies SearchLink[],
};

const DocsLayoutRoute = lazy(() =>
  import('@/pages/docs/shell').then((m) => ({ default: m.DocsLayoutRoute }))
);
const DocsPage = lazy(() => import('@/pages/docs/shell').then((m) => ({ default: m.DocsPage })));

function Layout() {
  return (
    <div className="min-h-svh font-sans antialiased" lang="en">
      <SafeAreaProvider>
        <RootProvider search={search}>
          <Seo />
          <Outlet />
        </RootProvider>
      </SafeAreaProvider>
    </div>
  );
}

function ComponentRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/docs/components/${slug ?? ''}`} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="docs"
          element={
            <Suspense fallback={<DocsLoading />}>
              <DocsLayoutRoute />
            </Suspense>
          }>
          <Route index element={<DocsPage />} />
          <Route path="*" element={<DocsPage />} />
        </Route>

        <Route path="docs/home" element={<Navigate to="/docs" replace />} />
        <Route path="getting-started/introduction" element={<Navigate to="/docs/introduction" replace />} />
        <Route path="getting-started/initial-setup" element={<Navigate to="/docs/installation" replace />} />
        <Route path="docs/implants/about" element={<Navigate to="/docs/client/implants" replace />} />
        <Route path="docs/implants/preface" element={<Navigate to="/docs/client/implants/advanced" replace />} />
        <Route path="docs/client/implants/preface" element={<Navigate to="/docs/client/implants/advanced" replace />} />
        <Route path="components/:slug" element={<ComponentRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
