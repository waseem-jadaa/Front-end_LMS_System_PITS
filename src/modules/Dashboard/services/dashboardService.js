import apiClient from '@/core/network/apiClient'

const dashboardService = {
  getStats:      () => apiClient.get('/dashboard/stats'),
  getRecentBooks:() => apiClient.get('/dashboard/recent-books')
}

export default dashboardService
