<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="modal-backdrop-custom" @click.self="$emit('close')">
        <div class="modal-dialog-custom rounded-4 shadow-lg" :dir="dir" role="dialog" aria-modal="true">
          <div class="d-flex align-items-center justify-content-between px-4 pt-4 pb-3 modal-header-custom">
            <div>
              <h5 class="fw-bold font-serif mb-0 modal-title-custom">{{ t('books.history.title') }}</h5>
              <p class="small text-muted mb-0">{{ bookTitle }}</p>
            </div>
            <button type="button" class="btn-close" :aria-label="t('books.actions.close')" @click="$emit('close')"></button>
          </div>

          <div class="px-4 pb-4 history-body">
            <div v-if="loading" class="text-center py-4">
              <span class="spinner-border spinner-border-sm text-secondary" role="status" aria-hidden="true"></span>
            </div>

            <div v-else-if="!entries.length" class="text-center py-4">
              <img :src="fileIcon" alt="" width="28" height="28" class="mb-2 opacity-50" />
              <p class="small text-muted mb-0">{{ t('books.history.empty') }}</p>
            </div>

            <ul v-else class="list-unstyled history-list mb-0">
              <li v-for="(entry, idx) in entries" :key="entry.id ?? idx" class="history-entry d-flex gap-3">
                <div class="history-dot flex-shrink-0"></div>
                <div class="flex-grow-1 min-w-0 pb-3">
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <p class="mb-0 fw-semibold history-action">{{ entry.description || t('books.history.unknownAction') }}</p>
                    <span v-if="entryEventLabel(entry)" class="badge event-badge">{{ entryEventLabel(entry) }}</span>
                  </div>
                  <p class="mb-0 small text-muted">
                    <span v-if="entryActor(entry)">{{ entryActor(entry) }} &middot; </span>{{ entryDate(entry) }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import fileIcon from '../../../assets/icons/file-text.svg'

const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')

defineProps({
  show:      { type: Boolean, default: false },
  bookTitle: { type: String, default: '' },
  entries:   { type: Array, default: () => [] },
  loading:   { type: Boolean, default: false }
})

defineEmits(['close'])

const EVENT_LABELS = {
  created: 'books.history.events.created',
  updated: 'books.history.events.updated',
  deleted: 'books.history.events.deleted',
  restored: 'books.history.events.restored'
}

function entryEventLabel(entry) {
  if (!entry.event) return ''
  const key = EVENT_LABELS[entry.event]
  return key ? t(key) : entry.event
}

function entryActor(entry) {
  if (!entry.causer_id) return ''
  const type = entry.causer_type ? entry.causer_type.split('\\').pop() : t('books.history.someone')
  return `${type} #${entry.causer_id}`
}

function entryDate(entry) {
  const raw = entry.created_at
  if (!raw) return ''
  try {
    return new Intl.DateTimeFormat(locale.value === 'ar' ? 'ar' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(raw))
  } catch {
    return raw
  }
}
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(26, 46, 64, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1055;
}

.modal-dialog-custom {
  width: 100%;
  max-width: 480px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}

.modal-title-custom {
  color: var(--navy);
}

.history-body {
  overflow-y: auto;
}

.history-list {
  margin: 0;
  padding-inline-start: 0.25rem;
}

.history-dot {
  width: 10px;
  height: 10px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--gold);
  border: 2px solid var(--gold-tint);
}

.history-action {
  color: var(--navy);
}

.event-badge {
  font-size: 10px;
  background-color: var(--gold-tint);
  color: var(--wood);
  text-transform: capitalize;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-dialog-custom,
.modal-fade-leave-active .modal-dialog-custom {
  transition: transform 0.22s ease;
}

.modal-fade-enter-from .modal-dialog-custom,
.modal-fade-leave-to .modal-dialog-custom {
  transform: translateY(12px) scale(0.98);
}
</style>
