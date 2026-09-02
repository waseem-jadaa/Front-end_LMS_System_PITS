import apiClient from '@/core/network/apiClient'
import { API_ROUTES } from '@/core/utils/constants'

const booksService = {

  index: (params) =>
    apiClient.get(API_ROUTES.BOOKS, { params }),

  show: (id) =>
    apiClient.get(`${API_ROUTES.BOOKS}/${id}`),

  store: (payload) =>
    apiClient.post(API_ROUTES.BOOKS, payload),

  update: (id, payload) =>
    apiClient.put(`${API_ROUTES.BOOKS}/${id}`, payload),

  destroy: (id) =>
    apiClient.delete(`${API_ROUTES.BOOKS}/${id}`),

  restore: (id) =>
    apiClient.post(`${API_ROUTES.BOOKS}/${id}/restore`),

  history: (id) =>
    apiClient.get(`${API_ROUTES.BOOKS}/${id}/history`),

  statistics: () =>
    apiClient.get(`${API_ROUTES.BOOKS}/statistics`)
}

export default booksService
