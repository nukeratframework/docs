import { docsTo, isInternalDocsHref } from '@/lib/docs-i18n';
import { getDocsSearchForNavigation } from '@/lib/docs-lang-context';
import { useLocation, useNavigate } from 'react-router-dom';

export function usePathname() {
  return useLocation().pathname;
}

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    push: (href: string) => {
      if (isInternalDocsHref(href)) {
        navigate(docsTo(href, getDocsSearchForNavigation(location.search)));
        return;
      }
      navigate(href);
    },
    replace: (href: string) => {
      if (isInternalDocsHref(href)) {
        navigate(docsTo(href, getDocsSearchForNavigation(location.search)), { replace: true });
        return;
      }
      navigate(href, { replace: true });
    },
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => navigate(0),
  };
}

export function notFound() {
  throw new Response('Not Found', { status: 404 });
}
