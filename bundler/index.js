/**
 * 三步构建（对齐 surmon.me bundler）：
 *   1. BFF server  → dist/bff.js
 *   2. SSR client  → dist/client/
 *   3. SSR server  → dist/server/ssr.js
 *   4. manifest/template 移至 dist 根目录供 prod renderer 读取
 */
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { bundleBFFServer } from './step-bff.js'
import { bundleClientRender } from './step-client.js'
import { bundleServerRender } from './step-server.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const ROOT_PATH = path.join(__dirname, '..')
const DIST_PATH = path.join(ROOT_PATH, 'dist')
const DIR_PATHS = {
  root: ROOT_PATH,
  src: path.join(ROOT_PATH, 'src'),
  dist: DIST_PATH,
  client: path.join(DIST_PATH, 'client'),
  server: path.join(DIST_PATH, 'server')
}

try {
  await fs.emptyDir(DIST_PATH)

  console.log('1. BFF server bundling...')
  await bundleBFFServer(DIR_PATHS)

  console.log('2. Client render bundling...')
  await bundleClientRender(DIR_PATHS)

  console.log('3. Server render bundling...')
  await bundleServerRender(DIR_PATHS)

  console.log('4. Resolve manifest & template...')
  await fs.move(path.resolve(DIR_PATHS.client, '.vite', 'manifest.json'), path.resolve(DIST_PATH, 'manifest.json'))
  await fs.move(path.resolve(DIR_PATHS.client, 'index.html'), path.resolve(DIST_PATH, 'template.html'))

  console.log('Everything done!')
  process.exit(0)
} catch (error) {
  console.error('bundle ERROR!', error)
  process.exit(1)
}
