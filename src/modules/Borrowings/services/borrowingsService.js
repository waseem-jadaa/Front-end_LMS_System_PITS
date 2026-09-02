import apiClient from '@/core/network/apiClient'
import { API_ROUTES } from '@/core/utils/constants'

const borrowingsService = {

  index: (params) =>
    apiClient.get(API_ROUTES.BORROWINGS, { params }),

  show: (id) =>
    apiClient.get(`${API_ROUTES.BORROWINGS}/${id}`),

  store: (payload) =>
    apiClient.post(API_ROUTES.BORROWINGS, payload),

  update: (id, payload) =>
    apiClient.put(`${API_ROUTES.BORROWINGS}/${id}`, payload),

  destroy: (id) =>
    apiClient.delete(`${API_ROUTES.BORROWINGS}/${id}`),

  return: (id) =>
    apiClient.post(`${API_ROUTES.BORROWINGS}/${id}/return`)
}

export default borrowingsService
