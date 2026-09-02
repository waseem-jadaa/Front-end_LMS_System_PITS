<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="modal-backdrop-custom" @click.self="handleClose">
        <div class="modal-dialog-custom rounded-4 shadow-lg" :dir="dir" role="dialog" aria-modal="true">
          <div class="d-flex align-items-center justify-content-between px-4 pt-4 pb-3 modal-header-custom">
            <h5 class="fw-bold font-serif mb-0 modal-title-custom">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" :aria-label="t('members.actions.close')" @click="handleClose"></button>
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
                v-model="form.name"
                :label="t('members.form.fields.name')"
                :placeholder="t('members.form.fields.namePlaceholder')"
                :icon="userIcon"
                :error="errors.name"
                :disabled="isViewMode"
                autocomplete="name"
              />
              <BaseInput
                v-model="form.email"
                type="email"
                :label="t('members.form.fields.email')"
                :placeholder="t('members.form.fields.emailPlaceholder')"
                :icon="mailIcon"
                :error="errors.email"
                :disabled="isViewMode"
                autocomplete="email"
              />
            </div>

            <div class="d-flex justify-content-end gap-2 px-4 py-4 mt-2">
              <template v-if="isViewMode">
                <BaseButton variant="light" type="button" @click="handleClose">{{ t('members.actions.close') }}</BaseButton>
                <BaseButton class="btn-member-submit" variant="warning" type="button" @click="switchToEdit">{{ t('members.actions.edit') }}</BaseButton>
              </template>
              <template v-else>
                <BaseButton variant="light" type="button" :disabled="loading" @click="handleClose">{{ t('members.actions.cancel') }}</BaseButton>
                <BaseButton class="btn-member-submit" variant="warning" type="submit" :loading="loading">
                  {{ loading ? t('members.actions.saving') : t('members.actions.save') }}
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
import { useMembersStore } from '../store/membersStore'
import userIcon  from '../../../assets/icons/user.svg'
import mailIcon  from '../../../assets/icons/mail.svg'
import alertIcon from '../../../assets/icons/alert-circle.svg'

const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const membersStore = useMembersStore()

const props = defineProps({
  show:   { type: Boolean, default: false },
  mode:   { type: String, default: 'view' },
  member: { type: Object, default: null }
})

const emit = defineEmits(['close', 'saved'])

const localMode = ref(props.mode)
const isCreateMode = computed(() => localMode.value === 'create')
const isViewMode   = computed(() => localMode.value === 'view')

const modalTitle = computed(() => {
  if (isCreateMode.value) return t('members.form.createTitle')
  if (isViewMode.value)   return t('members.form.viewTitle')
  return t('members.form.editTitle')
})

const form   = reactive({ name: '', email: '' })
const errors = reactive({ name: '', email: '' })
const generalError = ref('')
const loading = computed(() => membersStore.saving)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function resetForm() {
  form.name  = props.member?.name  ?? ''
  form.email = props.member?.email ?? ''
  errors.name = ''
  errors.email = ''
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
  errors.name = ''
  errors.email = ''
  let ok = true
  if (!form.name.trim())       { errors.name  = t('members.form.validation.nameRequired');  ok = false }
  if (!form.email.trim())      { errors.email = t('members.form.validation.emailRequired'); ok = false }
  else if (!EMAIL_RE.test(form.email)) { errors.email = t('members.form.validation.emailInvalid'); ok = false }
  return ok
}

function handleClose() {
  emit('close')
}

async function handleSubmit() {
  if (!validate()) return
  generalError.value = ''
  try {
    const payload = { name: form.name.trim(), email: form.email.trim() }
    const result = isCreateMode.value
      ? await membersStore.createMember(payload)
      : await membersStore.updateMember(props.member.id, payload)
    emit('saved', { mode: localMode.value, member: result })
    emit('close')
  } catch (err) {
    const fallback = isCreateMode.value ? t('members.form.messages.createFailed') : t('members.form.messages.updateFailed')
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

.btn-member-submit {
  background: var(--mustard);
  color: var(--navy);
  border: none;
  font-weight: 600;
}

.btn-member-submit:hover:not(:disabled) {
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
