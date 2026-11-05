import {
  LinkTabs,
  LinkTabsContent,
  LinkTabsList,
  LinkTabsTrigger,
} from '@/ui/link-tabs';
import type { ReactNode } from 'react';

export function InstallationTabs({
  value,
  children,
}: {
  value: 'cli' | 'manual';
  children: ReactNode;
}) {
  return (
    <LinkTabs
      ref={onRef(value)}
      value={value === 'cli' ? '/docs/installation' : '/docs/installation/manual'}>
      <LinkTabsList>
        <LinkTabsTrigger to="/docs/installation">Quick install</LinkTabsTrigger>
        <LinkTabsTrigger to="/docs/installation/manual">Manual install</LinkTabsTrigger>
      </LinkTabsList>
      <LinkTabsContent value={value === 'cli' ? '/docs/installation' : '/docs/installation/manual'}>
        {children}
      </LinkTabsContent>
    </LinkTabs>
  );
}

function onRef(value: 'cli' | 'manual') {
  return () => {
    if (value === 'cli') {
      return;
    }
    const link = document.querySelector(
      'a[data-active="false"][href="/docs/installation"]'
    ) as HTMLAnchorElement | null;
    if (!link) {
      return;
    }
    link.classList.add('!bg-primary/10');
    link.classList.add('!text-primary');
    link.classList.add('!font-medium');
    return () => {
      link.classList.remove('!bg-primary/10');
      link.classList.remove('!text-primary');
      link.classList.remove('!font-medium');
    };
  };
}
