import { docsTo, isInternalDocsHref } from '@/lib/docs-i18n';
import { useDocsLang } from '@/lib/docs-lang-context';
import { Link, type LinkProps } from 'react-router-dom';

/** React Router link that keeps `?lang=` (and other docs query params) when moving between doc pages. */
export function DocsLink({ to, ...props }: LinkProps) {
  const { docsSearch } = useDocsLang();

  if (typeof to === 'string' && isInternalDocsHref(to)) {
    return <Link to={docsTo(to, docsSearch)} {...props} />;
  }

  return <Link to={to} {...props} />;
}
