declare module 'aplayer' {
  export default class APlayer {
    constructor(options: Record<string, any>)
    destroy(): void
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
