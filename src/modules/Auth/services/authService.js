import apiClient from '@/core/network/apiClient'
import { API_ROUTES } from '@/core/utils/constants'

const authService = {

  login: (credentials) =>
    apiClient.post(API_ROUTES.LOGIN, credentials),

  register: (payload) =>
    apiClient.post(API_ROUTES.REGISTER, payload)
}

export default authService
