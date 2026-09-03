<template>
  <div class="d-flex chat-row" :class="isUser ? 'justify-content-end' : 'justify-content-start'">
    <div v-if="!isUser" class="chat-avatar rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
      <img :src="sparklesIcon" alt="" width="15" height="15" />
    </div>

    <div class="chat-bubble" :class="isUser ? 'chat-bubble--user' : 'chat-bubble--assistant'">
      <div v-if="message.typing" class="typing-dots">
        <span></span><span></span><span></span>
      </div>
      <p v-else class="mb-0 chat-text">{{ message.text }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import sparklesIcon from '../../../assets/icons/sparkles.svg'

const props = defineProps({
  message: { type: Object, required: true }
})

const isUser = computed(() => props.message.role === 'user')
</script>

<style scoped>
.chat-row {
  margin-bottom: 1rem;
}

.chat-avatar {
  width: 30px;
  height: 30px;
  background: var(--navy);
  margin-inline-end: 0.6rem;
  margin-top: 2px;
}

.chat-bubble {
  max-width: min(75%, 560px);
  padding: 0.65rem 1rem;
  border-radius: 1rem;
  line-height: 1.6;
  font-size: 0.92rem;
}

.chat-text {
  word-break: break-word;
  white-space: pre-wrap;
}

.chat-bubble--user {
  background: var(--navy);
  color: #fff;
}

.chat-bubble--assistant {
  background: var(--gold-tint);
  color: var(--text-body);
  border: 1px solid var(--border);
}

.typing-dots {
  display: flex;
  gap: 4px;
  padding: 0.2rem 0.15rem;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
  animation: typing-bounce 1.2s infinite ease-in-out;
}

.typing-dots span:nth-child(2) { animation-delay: 0.15s; }
.typing-dots span:nth-child(3) { animation-delay: 0.3s; }

@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30%           { transform: translateY(-4px); opacity: 1; }
}
</style>
