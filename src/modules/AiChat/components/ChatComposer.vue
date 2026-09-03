<template>
  <div class="chat-composer d-flex align-items-end gap-2 p-3">
    <textarea
      ref="textareaEl"
      v-model="localValue"
      class="chat-textarea flex-grow-1"
      :placeholder="placeholder"
      rows="1"
      @input="autoResize"
      @keydown.enter.exact.prevent="onSend"
    ></textarea>
    <button
      type="button"
      class="chat-send-btn rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
      :disabled="sending || !localValue.trim()"
      @click="onSend"
    >
      <span v-if="sending" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <img v-else :src="sendIcon" alt="" width="18" height="18" />
    </button>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'
import sendIcon from '../../../assets/icons/send.svg'

const props = defineProps({
  modelValue:  { type: String, default: '' },
  placeholder: { type: String, default: '' },
  sending:     { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'send'])

const textareaEl = ref(null)
const localValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  if (val !== localValue.value) {
    localValue.value = val
    nextTick(autoResize)
  }
})

watch(localValue, (val) => emit('update:modelValue', val))

function autoResize() {
  const el = textareaEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 140) + 'px'
}

function onSend() {
  if (props.sending || !localValue.value.trim()) return
  emit('send')
}

onMounted(autoResize)
</script>

<style scoped>
.chat-composer {
  border-top: 1px solid var(--border);
  background: var(--bg-page);
  flex-shrink: 0;
}

.chat-textarea {
  resize: none;
  border: 1.5px solid var(--border);
  border-radius: 0.75rem;
  background: #fff;
  padding: 0.65rem 0.9rem;
  font-size: 0.9rem;
  color: var(--text-body);
  outline: none;
  max-height: 140px;
  line-height: 1.5;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.chat-textarea::placeholder { color: #B8AFA6; }

.chat-textarea:focus {
  border-color: var(--navy);
  box-shadow: 0 0 0 3px rgba(26, 46, 64, 0.15);
}

.chat-send-btn {
  width: 44px;
  height: 44px;
  background: var(--mustard);
  border: none;
  color: var(--navy);
  transition: background 0.2s, transform 0.15s;
}

.chat-send-btn:hover:not(:disabled) {
  background: var(--gold);
  transform: translateY(-1px);
}

.chat-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
