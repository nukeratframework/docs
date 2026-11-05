import { docsTo, isInternalDocsHref } from '@/lib/docs-i18n';
import { getDocsSearchForNavigation, useOptionalDocsLang } from '@/lib/docs-lang-context';
import { Link as RouterLink, useLocation, type LinkProps } from 'react-router-dom';

type RouterLinkProps = Omit<LinkProps, 'to'> & {
  href: string;
};

export default function Link({ href, children, ...props }: RouterLinkProps) {
  const docsLang = useOptionalDocsLang();
  const location = useLocation();
  const docsSearch = docsLang?.docsSearch ?? getDocsSearchForNavigation(location.search);
  let to: LinkProps['to'] = href;

  if (isInternalDocsHref(href)) {
    to = docsTo(href, docsSearch);
  }

  return (
    <RouterLink to={to} {...props}>
      {children}
    </RouterLink>
  );
}
