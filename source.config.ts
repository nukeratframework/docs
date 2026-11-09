import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

export const { docs: docsEnUs, meta: metaEnUs } = defineDocs({
  dir: 'src/pages/docs/mdx/en-us',
});

export const { docs: docsRu, meta: metaRu } = defineDocs({
  dir: 'src/pages/docs/mdx/ru',
});

export const { docs: docsZhCn, meta: metaZhCn } = defineDocs({
  dir: 'src/pages/docs/mdx/zh-cn',
});

export const { docs: docsKoKr, meta: metaKoKr } = defineDocs({
  dir: 'src/pages/docs/mdx/ko-kr',
});

export const { docs: docsFaIr, meta: metaFaIr } = defineDocs({
  dir: 'src/pages/docs/mdx/fa-ir',
});

export const { docs: docsEsEs, meta: metaEsEs } = defineDocs({
  dir: 'src/pages/docs/mdx/es-es',
});

export const { docs: docsJaJp, meta: metaJaJp } = defineDocs({
  dir: 'src/pages/docs/mdx/ja-jp',
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: { light: 'github-dark-default', dark: 'github-dark-default' },
      theme: 'github-dark-default',
      langAlias: {
        'text-plain': 'plaintext',
        JSON: 'json',
      },
    },
  },
});
