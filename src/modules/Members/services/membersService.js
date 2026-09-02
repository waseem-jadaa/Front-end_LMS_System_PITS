import apiClient from '@/core/network/apiClient'
import { API_ROUTES } from '@/core/utils/constants'

const membersService = {

  index: (params) =>
    apiClient.get(API_ROUTES.MEMBERS, { params }),

  show: (id) =>
    apiClient.get(`${API_ROUTES.MEMBERS}/${id}`),

  store: (payload) =>
    apiClient.post(API_ROUTES.MEMBERS, payload),

  update: (id, payload) =>
    apiClient.put(`${API_ROUTES.MEMBERS}/${id}`, payload),

  destroy: (id) =>
    apiClient.delete(`${API_ROUTES.MEMBERS}/${id}`)
}

export default membersService
