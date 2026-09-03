<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './modules/Auth/store/authStore'
import AiChatFab from './core/components/AiChatFab.vue'

const route = useRoute()
const authStore = useAuthStore()

const showFab = computed(() =>
  authStore.isAuthenticated && !authStore.isGuest && route.name !== 'ai-chat'
)
</script>

<template>
  <router-view />
  <AiChatFab v-if="showFab" />
</template>
