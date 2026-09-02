import { defineStore } from 'pinia'
import { ref } from 'vue'
import membersService from '../services/membersService'
import { extractList, extractRecord } from '@/core/utils/apiHelpers'

export const useMembersStore = defineStore('members', () => {
  const members       = ref([])
  const currentMember = ref(null)
  const meta          = ref(null)
  const loading       = ref(false)
  const saving        = ref(false)
  const deleting      = ref(false)
  const error         = ref(null)

  async function fetchMembers(params = {}) {
    loading.value = true; error.value = null
    try {
      const res = await membersService.index(params)
      const { list, meta: pageMeta } = extractList(res)
      members.value = list
      meta.value = pageMeta
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      members.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchMember(id) {
    loading.value = true; error.value = null
    try {
      const res = await membersService.show(id)
      currentMember.value = extractRecord(res)
      return currentMember.value
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createMember(payload) {
    saving.value = true; error.value = null
    try {
      const res = await membersService.store(payload)
      const created = extractRecord(res)
      members.value.unshift(created)
      return created
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function updateMember(id, payload) {
    saving.value = true; error.value = null
    try {
      const res = await membersService.update(id, payload)
      const updated = extractRecord(res)
      const idx = members.value.findIndex(m => m.id === id)
      if (idx !== -1) members.value[idx] = updated
      return updated
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      saving.value = false
    }
  }

  async function deleteMember(id) {
    deleting.value = true; error.value = null
    try {
      await membersService.destroy(id)
      members.value = members.value.filter(m => m.id !== id)
    } catch (err) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      deleting.value = false
    }
  }

  return {
    members, currentMember, meta, loading, saving, deleting, error,
    fetchMembers, fetchMember, createMember, updateMember, deleteMember
  }
})
