export const formatDate = (iso, locale = 'en-GB') =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(iso))

export const formatNumber = (n, locale = 'en-US') =>
  new Intl.NumberFormat(locale).format(n)

export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1)

export const truncate = (str = '', max = 60) =>
  str.length > max ? str.slice(0, max) + '\u2026' : str
