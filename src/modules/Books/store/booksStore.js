import { defineStore } from 'pinia'
import { ref } from 'vue'
import booksService from '../services/booksService'
import { extractList, extractRecord } from '@/core/utils/apiHelpers'

export const useBooksStore = defineStore('books', () => {
  const books             = ref([])
  const currentBook       = ref(null)
  const meta              = ref(null)
  const statistics        = ref(null)
  const historyEntries    = ref([])
  const loading           = ref(false)
  const saving            = ref(false)
  const deleting          = ref(false)
  const restoring         = ref(false)
  const statisticsLoading = ref(false)
  const historyLoading    = ref(false)
  const error             = ref(null)

  async function fetchBooks(params = {}) {
    loading.value = true; error.value = null
    try {
      const res = await booksService.index(params)
      const { list, meta: pageMeta } = extractList(res)
      books.value = list
      meta.value = pageMeta
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      books.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchBook(id) {
    loading.value = true; error.value = null
    try {
      const res = await booksService.show(id)
      currentBook.value = extractRecord(res)
      return currentBook.value
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createBook(payload) {
    saving.value = true; error.value = null
    try {
      const res = await booksService.store(payload)
      const created = extractRecord(res)
      books.value.unshift(created)
      return created
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function updateBook(id, payload) {
    saving.value = true; error.value = null
    try {
      const res = await booksService.update(id, payload)
      const updated = extractRecord(res)
      const idx = books.value.findIndex(b => b.id === id)
      if (idx !== -1) books.value[idx] = updated
      return updated
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function deleteBook(id) {
    deleting.value = true; error.value = null
    try {
      await booksService.destroy(id)
      books.value = books.value.filter(b => b.id !== id)
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      deleting.value = false
    }
  }

  async function restoreBook(id) {
    restoring.value = true; error.value = null
    try {
      const res = await booksService.restore(id)
      const restored = extractRecord(res)
      books.value = books.value.filter(b => b.id !== id)
      return restored
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      restoring.value = false
    }
  }

  async function fetchHistory(id) {
    historyLoading.value = true
    try {
      const res = await booksService.history(id)
      historyEntries.value = extractList(res).list
    } catch {
      historyEntries.value = []
    } finally {
      historyLoading.value = false
    }
  }

  async function fetchStatistics() {
    statisticsLoading.value = true
    try {
      const res = await booksService.statistics()
      statistics.value = extractRecord(res) ?? null
    } catch {
      statistics.value = null
    } finally {
      statisticsLoading.value = false
    }
  }

  return {
    books, currentBook, meta, statistics, historyEntries,
    loading, saving, deleting, restoring, statisticsLoading, historyLoading, error,
    fetchBooks, fetchBook, createBook, updateBook, deleteBook, restoreBook, fetchHistory, fetchStatistics
  }
})
