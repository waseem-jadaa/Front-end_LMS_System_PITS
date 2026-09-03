import { defineStore } from 'pinia'
import { ref } from 'vue'
import aiChatService from '../services/aiChatService'
import { extractRecord } from '@/core/utils/apiHelpers'

export const useAiChatStore = defineStore('aiChat', () => {
  const messages = ref([])
  const sending  = ref(false)
  const error    = ref(null)

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed) return

    messages.value.push({ id: crypto.randomUUID(), role: 'user', text: trimmed })
    sending.value = true; error.value = null

    try {
      const res = await aiChatService.send(trimmed)
      const data = extractRecord(res)
      messages.value.push({ id: crypto.randomUUID(), role: 'assistant', text: data?.answer || '' })
    } catch (err) {
      messages.value.pop()
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      sending.value = false
    }
  }

  function clearChat() {
    messages.value = []
    error.value = null
  }

  return { messages, sending, error, sendMessage, clearChat }
})
