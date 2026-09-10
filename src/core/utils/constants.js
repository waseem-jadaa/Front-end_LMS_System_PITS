export const APP_NAME       = 'Library System'
export const AUTH_TOKEN_KEY = 'auth_token'
export const AUTH_USER_KEY  = 'auth_user'
export const LANG_KEY       = 'lms_lang'

export const API_ROUTES = Object.freeze({
  LOGIN:           '/login',
  REGISTER:        '/register',
  LOGOUT:          '/logout',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD:  '/reset-password',
  MEMBERS:    '/members',
  BOOKS:      '/books',
  BORROWINGS: '/borrowings',
  AI_CHAT:    '/v1/chat'
})

export const ROLES = Object.freeze({
  ADMIN:  'admin',
  MEMBER: 'member',
  GUEST:  'guest'
})

export const GUEST_USER = Object.freeze({
  name: 'Guest',
  role: ROLES.GUEST
})
