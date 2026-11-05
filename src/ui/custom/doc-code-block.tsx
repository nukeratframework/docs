import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import type { ReactNode } from 'react';

export function DocCodeBlock({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <CodeBlock title={title} className={className}>
      <Pre>{typeof children === 'string' ? <code>{children}</code> : children}</Pre>
    </CodeBlock>
  );
}
