import { createRequire } from 'node:module';
import path from 'node:path';
import type { Plugin } from 'vite';

const require = createRequire(import.meta.url);
const mdxLoader = require('fumadocs-mdx/loader-mdx') as (
  this: LoaderContext,
  source: string
) => void;

type LoaderContext = {
  resourcePath: string;
  resourceQuery: string;
  context: string;
  mode: 'development' | 'production';
  cacheable: (flag?: boolean) => void;
  getOptions: () => { _ctx: { configPath: string } };
  async: () => (error: Error | null | undefined, code?: string, map?: string) => void;
};

const configPath = path.resolve(process.cwd(), 'source.config.ts');
const sourceDir = path.resolve(process.cwd(), '.source');

function runMdxLoader(source: string, id: string, mode: 'development' | 'production') {
  const [resourcePath, query = ''] = id.split('?');

  return new Promise<{ code: string; map?: string }>((resolve, reject) => {
    const context: LoaderContext = {
      resourcePath,
      resourceQuery: query ? `?${query}` : '',
      context: path.dirname(resourcePath),
      mode,
      cacheable: () => {},
      getOptions: () => ({ _ctx: { configPath } }),
      async: () => (error, code, map) => {
        if (error) reject(error);
        else resolve({ code: code ?? '', map });
      },
    };

    mdxLoader.call(context, source);
  });
}

async function generateSourceMap(isDev: boolean) {
  const { start } = await import('fumadocs-mdx/next');
  await start(isDev, configPath, sourceDir);
}

export function fumadocsMdx(): Plugin {
  let mode: 'development' | 'production' = 'production';

  return {
    name: 'fumadocs-mdx',
    enforce: 'pre',
    configResolved(config) {
      mode = config.mode === 'development' ? 'development' : 'production';
    },
    async buildStart() {
      await generateSourceMap(mode === 'development');
    },
    configureServer() {
      void generateSourceMap(true);
    },
    async transform(source, id) {
      const cleanId = id.split('?')[0];
      if (!cleanId.endsWith('.mdx') && !cleanId.endsWith('.md')) {
        return null;
      }

      const result = await runMdxLoader(source, id, mode);
      return {
        code: result.code,
        map: result.map,
      };
    },
  };
}
