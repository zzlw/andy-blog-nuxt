/**
 * @file vite 配置（client 构建 + dev middleware 共用）
 * @reference https://vite.dev/config/
 */

import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vuePlugin()],
  root: path.resolve(__dirname),
  publicDir: 'public',
  resolve: {
    alias: {
      '/@': path.resolve(__dirname, 'src'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '/src/styles/base/variables' as *;`
      }
    }
  },
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name]-[hash].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia', '@unhead/vue', 'axios', 'dayjs'],
          markdown: ['marked', 'marked-highlight', 'highlight.js']
        }
      }
    }
  }
})
