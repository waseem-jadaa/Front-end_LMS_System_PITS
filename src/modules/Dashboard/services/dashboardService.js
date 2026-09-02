import apiClient from '@/core/network/apiClient'
import { API_ROUTES } from '@/core/utils/constants'

const dashboardService = {

  getBookStatistics: () =>
    apiClient.get(`${API_ROUTES.BOOKS}/statistics`),

  getMembersCount: (params) =>
    apiClient.get(API_ROUTES.MEMBERS, { params }),

  getRecentBooks: (params) =>
    apiClient.get(API_ROUTES.BOOKS, { params })
}

export default dashboardService
