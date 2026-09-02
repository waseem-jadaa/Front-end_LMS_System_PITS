<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="modal-backdrop-custom" @click.self="handleClose">
        <div class="modal-dialog-custom rounded-4 shadow-lg" :dir="dir" role="dialog" aria-modal="true">
          <div class="d-flex align-items-center justify-content-between px-4 pt-4 pb-3 modal-header-custom">
            <h5 class="fw-bold font-serif mb-0 modal-title-custom">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" :aria-label="t('books.actions.close')" @click="handleClose"></button>
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
                v-model="form.title"
                :label="t('books.form.fields.title')"
                :placeholder="t('books.form.fields.titlePlaceholder')"
                :icon="bookIcon"
                :error="errors.title"
                :disabled="isViewMode"
              />
              <BaseInput
                v-model="form.author"
                :label="t('books.form.fields.author')"
                :placeholder="t('books.form.fields.authorPlaceholder')"
                :icon="userIcon"
                :error="errors.author"
                :disabled="isViewMode"
              />
              <BaseInput
                v-model="form.category"
                :label="t('books.form.fields.category')"
                :placeholder="t('books.form.fields.categoryPlaceholder')"
                :error="errors.category"
                :disabled="isViewMode"
              />
              <BaseInput
                v-model="form.publish_year"
                type="number"
                :label="t('books.form.fields.publishYear')"
                :placeholder="t('books.form.fields.publishYearPlaceholder')"
                :error="errors.publish_year"
                :disabled="isViewMode"
              />
            </div>

            <div class="d-flex justify-content-end gap-2 px-4 py-4 mt-2">
              <template v-if="isViewMode">
                <BaseButton variant="light" type="button" @click="handleClose">{{ t('books.actions.close') }}</BaseButton>
                <BaseButton v-if="canEdit" class="btn-book-submit" variant="warning" type="button" @click="switchToEdit">{{ t('books.actions.edit') }}</BaseButton>
              </template>
              <template v-else>
                <BaseButton variant="light" type="button" :disabled="loading" @click="handleClose">{{ t('books.actions.cancel') }}</BaseButton>
                <BaseButton class="btn-book-submit" variant="warning" type="submit" :loading="loading">
                  {{ loading ? t('books.actions.saving') : t('books.actions.save') }}
                </BaseButton>
              </template>
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
import { useAuthStore } from '@/modules/Auth/store/authStore'
import { useBooksStore } from '../store/booksStore'
import bookIcon  from '../../../assets/icons/book.svg'
import userIcon  from '../../../assets/icons/user.svg'
import alertIcon from '../../../assets/icons/alert-circle.svg'

const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const authStore = useAuthStore()
const booksStore = useBooksStore()
const canEdit = computed(() => authStore.isAdmin)

const props = defineProps({
  show: { type: Boolean, default: false },
  mode: { type: String, default: 'create' },
  book: { type: Object, default: null }
})

const emit = defineEmits(['close', 'saved'])

const localMode = ref(props.mode)
const isCreateMode = computed(() => localMode.value === 'create')
const isViewMode   = computed(() => localMode.value === 'view')

const modalTitle = computed(() => {
  if (isCreateMode.value) return t('books.form.createTitle')
  if (isViewMode.value)   return t('books.form.viewTitle')
  return t('books.form.editTitle')
})

const form   = reactive({ title: '', author: '', category: '', publish_year: '' })
const errors = reactive({ title: '', author: '', category: '', publish_year: '' })
const generalError = ref('')
const loading = computed(() => booksStore.saving)

function resetForm() {
  form.title        = props.book?.title        ?? ''
  form.author       = props.book?.author       ?? ''
  form.category     = props.book?.category     ?? ''
  form.publish_year = props.book?.publish_year ?? ''
  errors.title = ''
  errors.author = ''
  errors.category = ''
  errors.publish_year = ''
  generalError.value = ''
}

watch(() => props.show, (val) => {
  if (val) {
    localMode.value = props.mode
    resetForm()
  }
})

function switchToEdit() {
  localMode.value = 'edit'
}

function validate() {
  errors.title = ''
  errors.author = ''
  errors.category = ''
  errors.publish_year = ''
  let ok = true
  const currentYear = new Date().getFullYear()
  if (!form.title.trim())    { errors.title    = t('books.form.validation.titleRequired');    ok = false }
  if (!form.author.trim())   { errors.author   = t('books.form.validation.authorRequired');   ok = false }
  if (!form.category.trim()) { errors.category = t('books.form.validation.categoryRequired'); ok = false }
  if (!form.publish_year)    { errors.publish_year = t('books.form.validation.yearRequired'); ok = false }
  else if (Number(form.publish_year) > currentYear) { errors.publish_year = t('books.form.validation.yearInvalid'); ok = false }
  return ok
}

function handleClose() {
  emit('close')
}

async function handleSubmit() {
  if (!validate()) return
  generalError.value = ''
  try {
    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category.trim(),
      publish_year: Number(form.publish_year)
    }
    const result = isCreateMode.value
      ? await booksStore.createBook(payload)
      : await booksStore.updateBook(props.book.id, payload)
    emit('saved', { mode: localMode.value, book: result })
    emit('close')
  } catch (err) {
    const fallback = isCreateMode.value ? t('books.form.messages.createFailed') : t('books.form.messages.updateFailed')
    generalError.value = err?.response?.data?.message || fallback
    const serverErrors = err?.response?.data?.errors
    if (serverErrors) {
      Object.entries(serverErrors).forEach(([field, msg]) => {
        if (field in errors) errors[field] = Array.isArray(msg) ? msg[0] : msg
      })
    }
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
  max-height: 90vh;
  overflow-y: auto;
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

.btn-book-submit {
  background: var(--mustard);
  color: var(--navy);
  border: none;
  font-weight: 600;
}

.btn-book-submit:hover:not(:disabled) {
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
