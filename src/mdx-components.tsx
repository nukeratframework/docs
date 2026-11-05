import { cn } from '@/ui/cn';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    h1: ({ className, ...props }) => <h1 className={className} {...props} />,
    h2: ({ className, ...props }) => (
      <h2 className={cn(className, 'scroll-mt-20 font-medium')} {...props} />
    ),
    h3: ({ className, ...props }) => (
      <h3 className={cn(className, 'mb-6 mt-10 scroll-mt-20 font-medium')} {...props} />
    ),
    h4: ({ className, ...props }) => <h4 className={className} {...props} />,
    h5: ({ className, ...props }) => <h5 className={className} {...props} />,
    h6: ({ className, ...props }) => <h6 className={className} {...props} />,
    pre: ({ ref: _ref, className, ...props }) => (
      <CodeBlock
        {...props}
        className={cn(
          className,
          'bg-fd-foreground/95 dark:bg-fd-secondary/50 text-background dark:text-foreground *:dark relative'
        )}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
