/**
 * @file 应用错误模型
 */

export interface AppError {
  code: number
  message: string
}

export class AppErrorClass extends Error {
  constructor(
    message: string,
    public code: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const createAppError = (message: string, code = 500) => new AppErrorClass(message, code)

export const formatErrorToAppError = (error: unknown, fallback: AppError): AppError => {
  if (error instanceof AppErrorClass) {
    return { code: error.code, message: error.message }
  }
  if (error && typeof error === 'object') {
    const anyError = error as any
    const code = anyError.code ?? anyError.status ?? anyError.response?.status
    const message = anyError.message ?? anyError.response?.data?.message
    if (typeof code === 'number') {
      return { code, message: String(message ?? fallback.message) }
    }
    if (message) {
      return { code: fallback.code, message: String(message) }
    }
  }
  return fallback
}
