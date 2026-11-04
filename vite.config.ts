import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Vite 配置
 * - 别名 @ → src
 * - CSS Modules 类名用「组件目录名__类名」，不带 hash。
 *   这样在 Figma 里「Extract designs」/ 点选编辑时，图层与元素名可读（如 AssistantBar__bar）。
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: (name: string, filename: string) => {
        const file = path.basename(filename).replace(/\.module\.css$/, '');
        const owner = file === 'index' ? path.basename(path.dirname(filename)) : file;
        return `${owner}__${name}`;
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
});
