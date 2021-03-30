import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteESLint from '@ehutch79/vite-eslint';

const { resolve } = require('path');

function pathResolve(dir) {
  return resolve(__dirname, dir);
}
export default defineConfig({
  resolve: {
    alias: {
      // 键必须以斜线开始和结束
      '/@/': pathResolve('./src'),
      // '@pk': pathResolve('./src/packages'),
      // '/@cmps/': pathResolve('./src/packages/components'),
      // '/@inter/': pathResolve('./src/packages/interface'),
    },
  },
  plugins: [vue(), viteESLint()],
});
