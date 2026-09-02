<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="modal-backdrop-custom" @click.self="$emit('cancel')">
        <div class="modal-dialog-custom rounded-4 shadow-lg" :dir="dir" role="dialog" aria-modal="true">
          <div class="p-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <img :src="alertIcon" alt="" width="22" height="22" />
              <h5 class="fw-bold font-serif mb-0 confirm-title">{{ title }}</h5>
            </div>
            <p class="text-secondary mb-4 confirm-message">{{ message }}</p>
            <div class="d-flex justify-content-end gap-2">
              <BaseButton variant="light" @click="$emit('cancel')" :disabled="loading">
                {{ cancelLabel }}
              </BaseButton>
              <button type="button" :class="['btn rounded-3 fw-semibold d-flex align-items-center gap-2', danger ? 'btn-confirm-danger' : 'btn-confirm-primary']" :disabled="loading" @click="$emit('confirm')">
                <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>{{ confirmLabel }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from './BaseButton.vue'
import alertIcon from '../../assets/icons/alert-circle.svg'

const { locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')

defineProps({
  show:         { type: Boolean, default: false },
  title:        { type: String, required: true },
  message:      { type: String, required: true },
  confirmLabel: { type: String, required: true },
  cancelLabel:  { type: String, required: true },
  loading:      { type: Boolean, default: false },
  danger:       { type: Boolean, default: true }
})

defineEmits(['confirm', 'cancel'])
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
  max-width: 420px;
  background: var(--bg-card);
  border: 1px solid var(--border);
}

.confirm-title {
  color: var(--navy);
}

.confirm-message {
  line-height: 1.6;
}

.btn-confirm-danger {
  background: var(--burgundy);
  color: #fff;
  border: none;
  transition: background 0.2s, transform 0.15s;
}

.btn-confirm-danger:hover:not(:disabled) {
  background: #650018;
  transform: translateY(-1px);
}

.btn-confirm-primary {
  background: var(--mustard);
  color: var(--navy);
  border: none;
  transition: background 0.2s, transform 0.15s;
}

.btn-confirm-primary:hover:not(:disabled) {
  background: var(--gold);
  transform: translateY(-1px);
}

.btn-confirm-danger:disabled,
.btn-confirm-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
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
