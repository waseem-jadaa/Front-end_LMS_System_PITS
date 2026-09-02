import { defineStore } from 'pinia'
import { ref } from 'vue'
import borrowingsService from '../services/borrowingsService'
import { extractList, extractRecord } from '@/core/utils/apiHelpers'

export const useBorrowingsStore = defineStore('borrowings', () => {
  const borrowings       = ref([])
  const currentBorrowing = ref(null)
  const meta              = ref(null)
  const loading           = ref(false)
  const saving            = ref(false)
  const deleting          = ref(false)
  const returning         = ref(false)
  const error             = ref(null)

  async function fetchBorrowings(params = {}) {
    loading.value = true; error.value = null
    try {
      const res = await borrowingsService.index(params)
      const { list, meta: pageMeta } = extractList(res)
      borrowings.value = list
      meta.value = pageMeta
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      borrowings.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchBorrowing(id) {
    loading.value = true; error.value = null
    try {
      const res = await borrowingsService.show(id)
      currentBorrowing.value = extractRecord(res)
      return currentBorrowing.value
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createBorrowing(payload) {
    saving.value = true; error.value = null
    try {
      const res = await borrowingsService.store(payload)
      const created = extractRecord(res)
      borrowings.value.unshift(created)
      return created
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function updateBorrowing(id, payload) {
    saving.value = true; error.value = null
    try {
      const res = await borrowingsService.update(id, payload)
      const updated = extractRecord(res)
      const idx = borrowings.value.findIndex(b => b.id === id)
      if (idx !== -1) borrowings.value[idx] = updated
      return updated
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function deleteBorrowing(id) {
    deleting.value = true; error.value = null
    try {
      await borrowingsService.destroy(id)
      borrowings.value = borrowings.value.filter(b => b.id !== id)
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      deleting.value = false
    }
  }

  async function returnBorrowing(id) {
    returning.value = true; error.value = null
    try {
      const res = await borrowingsService.return(id)
      const returned = extractRecord(res)
      const idx = borrowings.value.findIndex(b => b.id === id)
      if (idx !== -1 && returned) borrowings.value[idx] = returned
      return returned
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      returning.value = false
    }
  }

  return {
    borrowings, currentBorrowing, meta, loading, saving, deleting, returning, error,
    fetchBorrowings, fetchBorrowing, createBorrowing, updateBorrowing, deleteBorrowing, returnBorrowing
  }
})
