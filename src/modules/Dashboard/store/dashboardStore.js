import { defineStore } from 'pinia'
import { ref } from 'vue'
import dashboardService from '../services/dashboardService'
import { extractList, extractRecord } from '@/core/utils/apiHelpers'

export const useDashboardStore = defineStore('dashboard', () => {
  const totalBooks    = ref(null)
  const activeMembers = ref(null)
  const books         = ref([])
  const statsLoading  = ref(false)
  const booksLoading  = ref(false)

  async function fetchStats() {
    statsLoading.value = true
    try {
      const [statsRes, membersRes] = await Promise.all([
        dashboardService.getBookStatistics(),
        dashboardService.getMembersCount({ page: 1 })
      ])
      const stats = extractRecord(statsRes) || {}
      totalBooks.value = stats.total_books ?? stats.total ?? null
      activeMembers.value = extractList(membersRes).meta?.total ?? null
    } catch {
      totalBooks.value = null
      activeMembers.value = null
    } finally {
      statsLoading.value = false
    }
  }

  async function fetchBooks(params = {}) {
    booksLoading.value = true
    try {
      const res = await dashboardService.getRecentBooks({ page: 1, ...params })
      books.value = extractList(res).list.slice(0, 3)
    } catch {
      books.value = []
    } finally {
      booksLoading.value = false
    }
  }

  return { totalBooks, activeMembers, books, statsLoading, booksLoading, fetchStats, fetchBooks }
})
