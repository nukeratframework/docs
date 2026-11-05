import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { fumadocsMdx } from './src/lib/fumadocs-mdx-vite';
import fs from 'node:fs';
import path from 'node:path';
import { transformWithEsbuild } from 'vite';

const RN_PRIMITIVES = fs
  .readdirSync(path.resolve(__dirname, 'node_modules/@rn-primitives'))
  .map((name) => `@rn-primitives/${name}`);

const FUMADOCS = path.resolve(__dirname, './src/lib/fumadocs');

function transpileRnPrimitives() {
  return {
    name: 'transpile-rn-primitives',
    enforce: 'pre',
    async transform(code, id) {
      const file = id.split('?')[0];
      if (!file.includes('@rn-primitives') || !/\.(mjs|js|tsx|jsx)$/.test(file)) {
        return null;
      }

      const loader = file.endsWith('.tsx') ? 'tsx' : 'jsx';
      return transformWithEsbuild(code, file, { loader, jsx: 'automatic' });
    },
  };
}

function rnPrimitivesWeb(): Plugin {
  return {
    name: 'rn-primitives-web',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source.includes('.web.')) {
        return null;
      }

      if (source.startsWith('.')) {
        if (!importer?.includes(`${path.sep}@rn-primitives${path.sep}`)) {
          return null;
        }

        const base = path.resolve(path.dirname(importer), source);
        const candidates = [
          `${base}.web.mjs`,
          path.join(base, 'index.web.mjs'),
          `${base}.mjs`,
          path.join(base, 'index.mjs'),
        ];

        for (const resolvedPath of candidates) {
          if (fs.existsSync(resolvedPath)) {
            return resolvedPath;
          }
        }

        return null;
      }

      const match = source.match(/^@rn-primitives\/[^/]+\/dist\/[^/]+$/);
      if (!match) {
        return null;
      }

      const webPath = `${match[0]}.web.mjs`;
      const absoluteWebPath = path.resolve('node_modules', webPath);
      return fs.existsSync(absoluteWebPath) ? absoluteWebPath : null;
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    fumadocsMdx(),
    rnPrimitivesWeb(),
    transpileRnPrimitives(),
    react({
      jsxImportSource: 'react',
      babel: {
        babelrc: false,
        configFile: false,
      },
      include: [/\.[jt]sx?$/, /node_modules\/@rn-primitives/],
    }),
  ],
  optimizeDeps: {
    exclude: ['fumadocs-ui', 'fumadocs-core', 'fumadocs-mdx'],
    include: [
      ...RN_PRIMITIVES,
      'react-native-web',
      'style-to-js',
      'style-to-object',
      'hast-util-to-jsx-runtime',
      'hast-util-to-estree',
      'extend',
      'is-plain-obj',
      'unified',
    ],
    esbuildOptions: {
      jsx: 'automatic',
      loader: {
        '.js': 'jsx',
        '.mjs': 'jsx',
      },
      resolveExtensions: ['.web.mjs', '.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.mjs', '.js', '.jsx', '.ts', '.tsx'],
    },
  },
  resolve: {
    alias: {
      '@/.source': path.resolve(__dirname, './.source'),
      'next/dynamic': path.join(FUMADOCS, 'dynamic.ts'),
      'next/link': path.join(FUMADOCS, 'link.tsx'),
      'next/navigation': path.join(FUMADOCS, 'navigation.ts'),
      'next/image': path.join(FUMADOCS, 'image.tsx'),
      'fumadocs-core/toc': path.join(FUMADOCS, 'toc.tsx'),
      '@': path.resolve(__dirname, './src'),
      'nativewind/jsx-runtime': 'react/jsx-runtime',
      'nativewind/jsx-dev-runtime': 'react/jsx-dev-runtime',
      'react-native': path.resolve(__dirname, './node_modules/react-native-web'),
      'react-native$': path.resolve(__dirname, './node_modules/react-native-web'),
      'react-native/Libraries/Utilities/codegenNativeComponent': 'react-native-web/dist/cjs/modules/codegenNativeComponent',
      'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
        'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
      'react-native/Libraries/vendor/emitter/EventEmitter$':
        'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
      'react-native/Libraries/EventEmitter/NativeEventEmitter$':
        'react-native-web/dist/vendor/react-native/NativeEventEmitter',
    },
    conditions: ['import', 'module', 'browser', 'default'],
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.web.mjs', '.mjs', '.tsx', '.ts', '.jsx', '.js'],
  },
  define: {
    __DEV__: JSON.stringify(mode !== 'production'),
    'process.env.NODE_ENV': JSON.stringify(mode),
    global: 'globalThis',
  },
  server: {
    port: 5173,
    strictPort: true,
  },
}));
