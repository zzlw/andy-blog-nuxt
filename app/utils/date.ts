import dayjs from 'dayjs'

export const dateFormat = (date?: string | Date | null, template = 'YYYY-MM-DD') => {
  return date ? dayjs(date).format(template) : ''
}

export const dateTimeFormat = (date?: string | Date | null) => {
  return dateFormat(date, 'YYYY-MM-DD HH:mm')
}
