'use client';

import { useOnChange } from 'fumadocs-core/utils/use-on-change';
import scrollIntoView from 'scroll-into-view-if-needed';
import { createContext, forwardRef, useContext, useEffect, useMemo, useRef, useState } from 'react';

const activeCtx = createContext<string[]>([]);
const scrollCtx = createContext<React.RefObject<HTMLElement | null>>({ current: null });

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string[]>([]);
  const key = ids.join(',');

  useEffect(() => {
    function update() {
      if (!ids.length) return setActive([]);

      const root = document.scrollingElement;
      if (!root) return;

      if (root.scrollTop <= 1) return setActive([ids[0]]);
      if (root.scrollTop + root.clientHeight >= root.scrollHeight - 6) {
        return setActive([ids.at(-1)!]);
      }

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 112) current = id;
      }
      setActive([current]);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('hashchange', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('hashchange', update);
    };
  }, [key]);

  return active;
}

export function useActiveAnchor() {
  return useContext(activeCtx).at(-1);
}

export function useActiveAnchors() {
  return useContext(activeCtx);
}

export function ScrollProvider({
  containerRef,
  children,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
  children?: React.ReactNode;
}) {
  return <scrollCtx.Provider value={containerRef}>{children}</scrollCtx.Provider>;
}

export function AnchorProvider({
  toc,
  children,
}: {
  toc: { url: string }[];
  single?: boolean;
  children?: React.ReactNode;
}) {
  const ids = useMemo(
    () => toc.map((item) => item.url.split('#')[1]).filter(Boolean),
    [toc]
  );
  const active = useScrollSpy(ids);
  return <activeCtx.Provider value={active}>{children}</activeCtx.Provider>;
}

export const TOCItem = forwardRef<
  HTMLAnchorElement,
  { href: string; onActiveChange?: (active: boolean) => void } & React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ onActiveChange, ...props }, ref) => {
  const container = useContext(scrollCtx);
  const isActive = useActiveAnchors().includes(props.href.slice(1));
  const el = useRef<HTMLAnchorElement>(null);

  useOnChange(isActive, (on) => {
    if (on && el.current && container.current) {
      scrollIntoView(el.current, { behavior: 'smooth', block: 'center', boundary: container.current });
    }
    onActiveChange?.(on);
  });

  return (
    <a
      ref={(node) => {
        el.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      data-active={isActive}
      {...props}
    />
  );
});

TOCItem.displayName = 'TOCItem';
