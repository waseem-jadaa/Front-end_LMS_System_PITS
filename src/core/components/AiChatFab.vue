<template>
  <button
    type="button"
    class="ai-chat-fab d-flex align-items-center justify-content-center"
    :title="t('aiChat.fab.label')"
    :aria-label="t('aiChat.fab.label')"
    @click="goToChat"
  >
    <span class="ai-chat-fab__ring"></span>
    <img :src="aiChatIcon" alt="" width="26" height="26" />
  </button>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import aiChatIcon from '../../assets/icons/ai-chat.svg'

const { t } = useI18n()
const router = useRouter()

function goToChat() {
  router.push({ name: 'ai-chat' })
}
</script>

<style scoped>
.ai-chat-fab {
  position: fixed;
  inset-block-end: 1.75rem;
  inset-inline-end: 1.75rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--navy);
  border: 2px solid var(--gold);
  box-shadow: 0 10px 28px rgba(26, 46, 64, 0.35), 0 3px 10px rgba(0, 0, 0, 0.15);
  z-index: 1040;
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.ai-chat-fab:hover {
  background: var(--navy-hover);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 14px 32px rgba(26, 46, 64, 0.4), 0 4px 12px rgba(0, 0, 0, 0.18);
}

.ai-chat-fab:active {
  transform: translateY(-1px) scale(0.98);
}

.ai-chat-fab__ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid var(--gold);
  opacity: 0.55;
  animation: fab-pulse 2.4s ease-out infinite;
  pointer-events: none;
}

@keyframes fab-pulse {
  0%   { transform: scale(0.85); opacity: 0.55; }
  70%  { transform: scale(1.25); opacity: 0; }
  100% { transform: scale(1.25); opacity: 0; }
}

@media (max-width: 575.98px) {
  .ai-chat-fab {
    width: 52px;
    height: 52px;
    inset-block-end: 1.25rem;
    inset-inline-end: 1.25rem;
  }
}
</style>
