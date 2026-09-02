<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="modal-backdrop-custom" @click.self="handleClose">
        <div class="modal-dialog-custom rounded-4 shadow-lg" :dir="dir" role="dialog" aria-modal="true">
          <div class="d-flex align-items-center justify-content-between px-4 pt-4 pb-3 modal-header-custom">
            <div>
              <h5 class="fw-bold font-serif mb-0 modal-title-custom">{{ t('borrowings.form.editTitle') }}</h5>
              <p class="small text-muted mb-0">{{ bookTitle }}</p>
            </div>
            <button type="button" class="btn-close" :aria-label="t('borrowings.actions.close')" @click="handleClose"></button>
          </div>

          <div class="px-4">
            <transition name="alert-fade">
              <div v-if="generalError" class="form-alert d-flex align-items-center gap-2 mb-3 px-3 py-2 rounded-3" role="alert">
                <img :src="alertIcon" alt="" width="16" height="16" />
                <span class="small flex-fill">{{ generalError }}</span>
              </div>
            </transition>
          </div>

          <form novalidate @submit.prevent="handleSubmit">
            <div class="px-4 d-flex flex-column gap-3">
              <BaseInput
                v-model="form.due_date"
                type="date"
                :label="t('borrowings.form.fields.dueDate')"
                :error="errors.due_date"
              />
            </div>

            <div class="d-flex justify-content-end gap-2 px-4 py-4 mt-2">
              <BaseButton variant="light" type="button" :disabled="loading" @click="handleClose">{{ t('borrowings.actions.cancel') }}</BaseButton>
              <BaseButton class="btn-borrowing-submit" variant="warning" type="submit" :loading="loading">
                {{ loading ? t('borrowings.actions.saving') : t('borrowings.actions.save') }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseInput from '@/core/components/BaseInput.vue'
import BaseButton from '@/core/components/BaseButton.vue'
import { useBorrowingsStore } from '../store/borrowingsStore'
import { getBookTitle, getDueDate } from '../utils/borrowingHelpers'
import alertIcon from '../../../assets/icons/alert-circle.svg'

const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const store = useBorrowingsStore()

const props = defineProps({
  show:      { type: Boolean, default: false },
  borrowing: { type: Object, default: null }
})

const emit = defineEmits(['close', 'saved'])

const bookTitle = computed(() => props.borrowing ? getBookTitle(props.borrowing) : '')
const form   = reactive({ due_date: '' })
const errors = reactive({ due_date: '' })
const generalError = ref('')
const loading = computed(() => store.saving)

function toDateInput(raw) {
  if (!raw) return ''
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

watch(() => props.show, (val) => {
  if (val && props.borrowing) {
    form.due_date = toDateInput(getDueDate(props.borrowing))
    errors.due_date = ''
    generalError.value = ''
  }
})

function handleClose() {
  emit('close')
}

async function handleSubmit() {
  errors.due_date = ''
  if (!form.due_date) { errors.due_date = t('borrowings.form.validation.dueDateRequired'); return }
  generalError.value = ''
  try {
    const updated = await store.updateBorrowing(props.borrowing.id, { due_date: form.due_date })
    emit('saved', updated)
    emit('close')
  } catch (err) {
    generalError.value = err?.response?.data?.message || t('borrowings.form.messages.updateFailed')
    const serverErrors = err?.response?.data?.errors
    if (serverErrors?.due_date) errors.due_date = Array.isArray(serverErrors.due_date) ? serverErrors.due_date[0] : serverErrors.due_date
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
  max-width: 420px;
  background: var(--bg-card);
  border: 1px solid var(--border);
}

.modal-title-custom {
  color: var(--navy);
}

.form-alert {
  font-size: 0.85rem;
  border: 1px solid rgba(128, 0, 32, 0.28);
  background: rgba(128, 0, 32, 0.07);
  color: var(--burgundy);
}

.btn-borrowing-submit {
  background: var(--mustard);
  color: var(--navy);
  border: none;
  font-weight: 600;
}

.btn-borrowing-submit:hover:not(:disabled) {
  background: var(--gold);
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

.alert-fade-enter-active { transition: opacity 0.3s, transform 0.3s; }
.alert-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.alert-fade-enter-from   { opacity: 0; transform: translateY(-8px); }
.alert-fade-leave-to     { opacity: 0; transform: translateY(-8px); }
</style>
