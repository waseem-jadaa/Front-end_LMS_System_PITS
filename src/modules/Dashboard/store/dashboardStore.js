import { defineStore } from 'pinia'
import { ref } from 'vue'
import dashboardService from '../services/dashboardService'

export const useDashboardStore = defineStore('dashboard', () => {
  const stats   = ref(null)
  const books   = ref([])
  const loading = ref(false)
  const error   = ref(null)

  const mockBooks = [
    { id: 1, title: 'قواعد العشق الأربعون', author: 'إليف شافاق', year: 2010, category: 'أدب وروايات', rating: 4.9 },
    { id: 2, title: 'مقدمة ابن خلدون',      author: 'ابن خلدون',   year: 1377, category: 'تاريخ وفلسفة', rating: 5.0 },
    { id: 3, title: 'المنقذ من الضلال',     author: 'الإمام الغزالي',year: 1100,category: 'فلسفة إسلامية',rating: 4.8 }
  ]

  async function fetchStats() {
    loading.value = true; error.value = null
    try {
      stats.value = await dashboardService.getStats()
    } catch {

    } finally {
      loading.value = false
    }
  }

  async function fetchBooks() {
    loading.value = true; error.value = null
    try {
      const res = await dashboardService.getRecentBooks()
      books.value = res.data ?? res
    } catch {
      books.value = mockBooks
    } finally {
      loading.value = false
    }
  }

  return { stats, books, loading, error, mockBooks, fetchStats, fetchBooks }
})
