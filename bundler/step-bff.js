import path from 'path'
import { build } from 'vite'

export const bundleBFFServer = async (paths) => {
  await build({
    configFile: false,
    resolve: { alias: { '@': paths.src, '/@': paths.src } },
    // SSR 模式构建：自动 external 全部 node_modules 依赖
    ssr: { external: true },
    build: {
      ssr: true,
      // Node 22 运行，支持 top-level await
      target: 'esnext',
      outDir: paths.dist,
      emptyOutDir: true,
      emitAssets: false,
      copyPublicDir: false,
      sourcemap: false,
      manifest: false,
      minify: false,
      rollupOptions: {
        input: path.join(paths.src, 'bff.ts'),
        output: { entryFileNames: 'bff.js' }
      }
    }
  })
}
