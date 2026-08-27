import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/core/utils/constants'

export const useAuthStore = defineStore('auth', () => {

  const user    = ref(JSON.parse(localStorage.getItem(AUTH_USER_KEY)) || null)
  const token   = ref(localStorage.getItem(AUTH_TOKEN_KEY) || null)
  const loading = ref(false)
  const error   = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const userName        = computed(() => user.value?.name ?? '')

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

  function logout() {
    user.value  = null
    token.value = null
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
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

  return { user, token, loading, error, isAuthenticated, userName, login, register, logout }
})
