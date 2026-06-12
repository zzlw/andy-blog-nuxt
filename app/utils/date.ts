import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

// 固定东八区格式化：服务端（UTC）与浏览器时区不同会导致 SSR 水合不一致
export const dateFormat = (date?: string | Date | null, template = 'YYYY-MM-DD') => {
  return date ? dayjs(date).utcOffset(8).format(template) : ''
}

export const dateTimeFormat = (date?: string | Date | null) => {
  return dateFormat(date, 'YYYY-MM-DD HH:mm')
}
