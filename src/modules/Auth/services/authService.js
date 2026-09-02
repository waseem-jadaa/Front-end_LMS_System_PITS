import apiClient from '@/core/network/apiClient'
import { API_ROUTES } from '@/core/utils/constants'

const authService = {

  login: (credentials) =>
    apiClient.post(API_ROUTES.LOGIN, credentials),

  register: (payload) =>
    apiClient.post(API_ROUTES.REGISTER, payload),

  logout: () =>
    apiClient.post(API_ROUTES.LOGOUT),

  forgotPassword: (payload) =>
    apiClient.post(API_ROUTES.FORGOT_PASSWORD, payload),

  resetPassword: (payload) =>
    apiClient.post(API_ROUTES.RESET_PASSWORD, payload)
}

export default authService
