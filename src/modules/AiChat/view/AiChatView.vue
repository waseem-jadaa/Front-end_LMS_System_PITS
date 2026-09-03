<template>
  <div class="container-fluid p-0 ai-chat-layout" :dir="dir">
    <Header />

    <div class="d-flex ai-chat-body">
      <Sidebar />

      <div class="flex-grow-1 p-3 p-md-4 d-flex flex-column content-col" dir="ltr">

        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3 p-md-4 rounded-4 shadow-sm mb-4 hero-card" :dir="dir">
          <div>
            <span class="badge mb-2 text-dark hero-badge">{{ t('aiChat.hero.badge') }}</span>
            <h1 class="fw-bold font-serif mb-2 hero-title">{{ t('aiChat.hero.title') }}</h1>
            <p class="text-secondary mb-0 hero-text">{{ t('aiChat.hero.text') }}</p>
          </div>
          <BaseButton variant="outline-dark" size="sm" :disabled="!store.messages.length" @click="handleNewChat">
            {{ t('aiChat.newChat') }}
          </BaseButton>
        </div>

        <transition name="alert-fade">
          <div v-if="pageAlert.show" class="page-alert d-flex align-items-center gap-2 mb-4 px-3 py-2 rounded-3 page-alert--error" role="alert" :dir="dir">
            <img :src="alertIcon" alt="" width="16" height="16" />
            <span class="small flex-fill">{{ pageAlert.message }}</span>
            <button type="button" class="btn-close btn-close-sm ms-auto" @click="pageAlert.show = false" aria-label="Close"></button>
          </div>
        </transition>

        <div class="chat-panel rounded-4 shadow-sm d-flex flex-column">
          <div ref="messagesEl" class="chat-messages" :dir="dir">
            <div v-if="!store.messages.length" class="chat-empty text-center">
              <div class="chat-empty-icon rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                <img :src="sparklesIcon" alt="" width="24" height="24" />
              </div>
              <p class="fw-semibold mb-1 empty-title">{{ t('aiChat.empty.title') }}</p>
              <p class="text-muted small mb-4">{{ t('aiChat.empty.text') }}</p>
              <div class="d-flex flex-wrap justify-content-center gap-2">
                <button
                  v-for="(suggestion, idx) in suggestions"
                  :key="idx"
                  type="button"
                  class="suggestion-chip"
                  @click="sendSuggestion(suggestion)"
                >
                  {{ suggestion }}
                </button>
              </div>
            </div>

            <template v-else>
              <ChatMessage v-for="message in store.messages" :key="message.id" :message="message" />
              <ChatMessage v-if="store.sending" :message="{ id: 'typing', role: 'assistant', typing: true }" />
            </template>
          </div>

          <ChatComposer
            v-model="draft"
            :sending="store.sending"
            :placeholder="t('aiChat.composer.placeholder')"
            @send="handleSend"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Header from '../../Dashboard/components/Header.vue'
import Sidebar from '../../Dashboard/components/Sidebar.vue'
import BaseButton from '@/core/components/BaseButton.vue'
import ChatMessage from '../components/ChatMessage.vue'
import ChatComposer from '../components/ChatComposer.vue'
import { useAiChatStore } from '../store/aiChatStore'
import alertIcon from '../../../assets/icons/alert-circle.svg'
import sparklesIcon from '../../../assets/icons/sparkles.svg'

const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const store = useAiChatStore()

const draft = ref('')
const messagesEl = ref(null)

const suggestions = computed(() => [
  t('aiChat.empty.suggestions.s1'),
  t('aiChat.empty.suggestions.s2'),
  t('aiChat.empty.suggestions.s3')
])

const pageAlert = reactive({ show: false, message: '' })
function showPageAlert(message) {
  pageAlert.show = true
  pageAlert.message = message
}

watch(() => [store.messages.length, store.sending], () => {
  nextTick(() => {
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  })
}, { flush: 'post' })

async function handleSend() {
  const text = draft.value.trim()
  if (!text || store.sending) return
  draft.value = ''
  try {
    await store.sendMessage(text)
  } catch {
    draft.value = text
    showPageAlert(t('aiChat.error.sendFailed'))
  }
}

function sendSuggestion(text) {
  draft.value = text
  handleSend()
}

function handleNewChat() {
  store.clearChat()
  draft.value = ''
  pageAlert.show = false
}
</script>

<style scoped>
.ai-chat-layout {
  background-color: var(--bg-page);
  min-height: 100vh;
  overflow-x: hidden;
}

.ai-chat-body {
  min-height: calc(100vh - 68px);
  min-width: 0;
}

.content-col {
  min-width: 0;
  min-height: calc(100vh - 68px);
}

.hero-card {
  background-color: var(--gold-tint);
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.hero-badge {
  background-color: var(--gold);
}

.hero-title {
  font-family: Georgia, serif;
  color: var(--navy);
  font-size: 1.75rem;
}

.hero-text {
  line-height: 1.8;
  max-width: 560px;
}

.page-alert {
  font-size: 0.85rem;
  border: 1px solid transparent;
  flex-shrink: 0;
}

.page-alert--error {
  background: rgba(128, 0, 32, 0.07);
  border-color: rgba(128, 0, 32, 0.28);
  color: var(--burgundy);
}

.chat-panel {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

.chat-messages {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 1.5rem;
}

.chat-empty {
  max-width: 480px;
  margin: 2.5rem auto;
}

.chat-empty-icon {
  width: 56px;
  height: 56px;
  background: var(--navy);
}

.empty-title {
  color: var(--navy);
}

.suggestion-chip {
  background: #fff;
  border: 1px solid var(--border);
  color: var(--wood);
  border-radius: 999px;
  padding: 0.45rem 1rem;
  font-size: 0.82rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.suggestion-chip:hover {
  background: var(--gold-tint);
  border-color: var(--gold);
  color: var(--navy);
}

.alert-fade-enter-active { transition: opacity 0.3s, transform 0.3s; }
.alert-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.alert-fade-enter-from   { opacity: 0; transform: translateY(-8px); }
.alert-fade-leave-to     { opacity: 0; transform: translateY(-8px); }

@media (max-width: 991.98px) {
  .hero-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 575.98px) {
  .hero-title {
    font-size: 1.3rem;
  }
}
</style>
