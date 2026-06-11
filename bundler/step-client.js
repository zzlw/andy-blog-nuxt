import { build } from 'vite'

export const bundleClientRender = async (paths) => {
  await build({
    build: {
      outDir: paths.client,
      sourcemap: false,
      minify: true,
      manifest: true,
      emptyOutDir: false
    }
  })
}
