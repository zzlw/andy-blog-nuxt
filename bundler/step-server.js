import path from 'path'
import { build } from 'vite'

export const bundleServerRender = async (paths) => {
  await build({
    publicDir: false,
    build: {
      ssr: true,
      target: 'esnext',
      minify: false,
      manifest: false,
      emptyOutDir: false,
      outDir: paths.server,
      rollupOptions: {
        input: path.join(paths.src, 'server-entry.ts'),
        output: {
          inlineDynamicImports: false,
          manualChunks: () => 'ssr',
          entryFileNames: 'ssr.js',
          chunkFileNames: 'ssr.js'
        }
      }
    }
  })
}
