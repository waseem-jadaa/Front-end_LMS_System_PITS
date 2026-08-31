export const isValidEmail = (email = '') =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const debounce = (fn, delay = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

export const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2)
    .map(w => w[0].toUpperCase()).join('')
