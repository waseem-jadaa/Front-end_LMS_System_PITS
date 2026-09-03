import apiClient from '@/core/network/apiClient'
import { API_ROUTES } from '@/core/utils/constants'

const aiChatService = {

  send: (message) =>
    apiClient.post(API_ROUTES.AI_CHAT, { message })
}

export default aiChatService
