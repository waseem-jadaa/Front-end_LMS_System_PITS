import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, ROLES, GUEST_USER } from '@/core/utils/constants'

export const useAuthStore = defineStore('auth', () => {

  const user    = ref(JSON.parse(localStorage.getItem(AUTH_USER_KEY)) || null)
  const token   = ref(localStorage.getItem(AUTH_TOKEN_KEY) || null)
  const loading = ref(false)
  const error   = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const userName        = computed(() => user.value?.name ?? '')
  const role            = computed(() => (user.value?.role ?? '').toLowerCase())
  const isAdmin         = computed(() => role.value === ROLES.ADMIN)
  const isMember        = computed(() => role.value === ROLES.MEMBER)
  const isGuest         = computed(() => role.value === ROLES.GUEST)

  async function login(credentials) {
    loading.value = true
    error.value   = null
    try {
      const res = await authService.login(credentials)
      _persist(res)
      return res
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(payload) {
    loading.value = true
    error.value   = null
    try {
      const res = await authService.register(payload)
      return res
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function loginAsGuest() {
    user.value  = { ...GUEST_USER }
    token.value = ROLES.GUEST
    localStorage.setItem(AUTH_TOKEN_KEY, token.value)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user.value))
  }

  async function logout() {
    loading.value = true
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout request failed:', err)
    } finally {
      user.value  = null
      token.value = null
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
      loading.value = false
    }
  }

  function _persist(res) {
    if (res.data?.token) {
      token.value = res.data.token
      localStorage.setItem(AUTH_TOKEN_KEY, token.value)
    }
    if (res.data?.user) {
      user.value = res.data.user
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user.value))
    }
  }

  return { user, token, loading, error, isAuthenticated, userName, role, isAdmin, isMember, isGuest, login, register, loginAsGuest, logout }
})
