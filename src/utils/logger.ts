/**
 * @file 同构 logger（带 scope 前缀）
 */

export const createLogger = (scope: string) => ({
  log: (...args: any[]) => console.log(`[${scope}]`, ...args),
  info: (...args: any[]) => console.info(`[${scope}]`, ...args),
  warn: (...args: any[]) => console.warn(`[${scope}]`, ...args),
  error: (...args: any[]) => console.error(`[${scope}]`, ...args),
  debug: (...args: any[]) => console.debug(`[${scope}]`, ...args)
})
