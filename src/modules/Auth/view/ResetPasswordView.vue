<template>

  <div class="auth-page d-flex align-items-center justify-content-center min-vh-100">

    <div class="auth-card rounded-4 overflow-hidden shadow-lg" :dir="dir">

      <div class="d-flex align-items-center justify-content-between mb-4">
        <div class="d-flex align-items-center gap-2">
          <div class="brand-badge">
            <img :src="bookOpenSvg" alt="" width="18" height="18" />
          </div>
          <span class="brand-name fw-semibold">{{ t('brand.name') }}</span>
        </div>

        <button
          class="lang-toggle d-flex align-items-center gap-1"
          @click="toggleLang"
          :title="locale === 'en' ? 'Switch to Arabic' : 'Switch to English'"
          type="button"
        >
          <img :src="languageSvg" alt="" width="16" height="16" class="lang-icon" />
          <span class="lang-label">{{ locale === 'en' ? 'عربي' : 'EN' }}</span>
        </button>
      </div>

      <router-link :to="{ name: 'auth' }" class="back-link d-inline-flex align-items-center gap-1 mb-3">
        <img :src="chevronLeftSvg" alt="" width="16" height="16" class="back-icon" />
        <span>{{ t('auth.resetPassword.backToLogin') }}</span>
      </router-link>

      <template v-if="!linkValid">
        <div class="check-email-icon check-email-icon--error mb-3">
          <img :src="alertCircleSvg" alt="" width="28" height="28" />
        </div>
        <h2 class="auth-heading mb-1">{{ t('auth.resetPassword.invalidLinkHeading') }}</h2>
        <p class="auth-subheading mb-4">{{ t('auth.resetPassword.invalidLinkText') }}</p>
        <router-link :to="{ name: 'forgot-password' }" class="btn-auth-submit w-100 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 text-decoration-none">
          {{ t('auth.resetPassword.requestNewLink') }}
        </router-link>
      </template>

      <template v-else-if="!submitted">
        <h2 class="auth-heading mb-1">{{ t('auth.resetPassword.heading') }}</h2>
        <p class="auth-subheading mb-4">{{ t('auth.resetPassword.subheading') }}</p>

        <transition name="alert-fade">
          <div
            v-if="alert.show"
            :class="['auth-alert d-flex align-items-center gap-2 mb-4 px-3 py-2 rounded-3', `auth-alert--${alert.type}`]"
            role="alert"
          >
            <img :src="alert.type === 'success' ? checkCircleSvg : alertCircleSvg" alt="" width="16" height="16" />
            <span class="small flex-fill">{{ alert.message }}</span>
            <button type="button" class="btn-close btn-close-sm ms-auto" @click="dismissAlert" aria-label="Close"></button>
          </div>
        </transition>

        <form novalidate @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="rp-password" class="form-label auth-label">{{ t('auth.resetPassword.newPassword') }}</label>
            <div class="input-wrap position-relative">
              <img :src="lockSvg" alt="" class="input-icon" width="16" height="16" />
              <input
                id="rp-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control auth-input auth-input--eye"
                :class="{ 'is-invalid': errors.password }"
                :placeholder="t('auth.resetPassword.newPasswordPlaceholder')"
                autocomplete="new-password"
              />
              <button type="button" class="eye-btn" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide' : 'Show'">
                <img :src="showPassword ? eyeSvg : eyeOffSvg" alt="" width="18" height="18" />
              </button>
              <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
            </div>
          </div>

          <div class="mb-4">
            <label for="rp-confirm" class="form-label auth-label">{{ t('auth.fields.confirmPassword') }}</label>
            <div class="input-wrap position-relative">
              <img :src="shieldCheckSvg" alt="" class="input-icon" width="16" height="16" />
              <input
                id="rp-confirm"
                v-model="passwordConfirmation"
                :type="showConfirm ? 'text' : 'password'"
                class="form-control auth-input auth-input--eye"
                :class="{ 'is-invalid': errors.password_confirmation }"
                :placeholder="t('auth.fields.confirmPasswordPlaceholder')"
                autocomplete="new-password"
              />
              <button type="button" class="eye-btn" @click="showConfirm = !showConfirm" :aria-label="showConfirm ? 'Hide' : 'Show'">
                <img :src="showConfirm ? eyeSvg : eyeOffSvg" alt="" width="18" height="18" />
              </button>
              <div v-if="errors.password_confirmation" class="invalid-feedback">{{ errors.password_confirmation }}</div>
            </div>
          </div>

          <button type="submit" class="btn-auth-submit w-100 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span>{{ loading ? t('auth.resetPassword.resetting') : t('auth.resetPassword.button') }}</span>
          </button>
        </form>
      </template>

      <template v-else>
        <div class="check-email-icon mb-3">
          <img :src="checkCircleSvg" alt="" width="28" height="28" />
        </div>
        <h2 class="auth-heading mb-1">{{ t('auth.resetPassword.heading') }}</h2>
        <p class="auth-subheading mb-4">{{ t('auth.resetPassword.success') }}</p>
        <router-link :to="{ name: 'auth' }" class="btn-auth-submit w-100 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 text-decoration-none">
          {{ t('auth.resetPassword.backToLogin') }}
        </router-link>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../store/authStore'

import bookOpenSvg     from '../../../assets/icons/book-open.svg'
import languageSvg     from '../../../assets/icons/language.svg'
import chevronLeftSvg  from '../../../assets/icons/chevron-left.svg'
import lockSvg         from '../../../assets/icons/lock.svg'
import eyeSvg          from '../../../assets/icons/eye.svg'
import eyeOffSvg       from '../../../assets/icons/eye-off.svg'
import shieldCheckSvg  from '../../../assets/icons/shield-check.svg'
import checkCircleSvg  from '../../../assets/icons/check-circle.svg'
import alertCircleSvg  from '../../../assets/icons/alert-circle.svg'

const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
function toggleLang() {
  locale.value = locale.value === 'en' ? 'ar' : 'en'
  localStorage.setItem('lms_lang', locale.value)
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const token = ref('')
const email = ref('')
const linkValid = ref(true)

onMounted(() => {
  token.value = route.query.token || ''
  email.value = route.query.email || ''
  linkValid.value = !!token.value && !!email.value
})

const showPassword = ref(false)
const showConfirm  = ref(false)
const loading      = ref(false)
const submitted    = ref(false)

const password             = ref('')
const passwordConfirmation = ref('')

const errors = reactive({ password: '', password_confirmation: '' })
function clearErrors() { errors.password = ''; errors.password_confirmation = '' }

const alert = reactive({ show: false, type: 'success', message: '' })
function showAlert(type, message) { alert.show = true; alert.type = type; alert.message = message }
function dismissAlert() { alert.show = false; alert.message = '' }

function validate() {
  clearErrors(); let ok = true
  if (!password.value)              { errors.password = t('auth.validation.passwordRequired'); ok = false }
  else if (password.value.length < 8) { errors.password = t('auth.validation.passwordMin');     ok = false }
  if (!passwordConfirmation.value)  { errors.password_confirmation = t('auth.validation.confirmRequired'); ok = false }
  else if (password.value !== passwordConfirmation.value) {
    errors.password_confirmation = t('auth.validation.passwordsMismatch'); ok = false
  }
  return ok
}

async function handleSubmit() {
  if (!validate()) return
  dismissAlert(); loading.value = true
  try {
    await authStore.resetPassword({
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    })
    submitted.value = true
  } catch (err) {
    const msg = err?.response?.data?.message || t('auth.resetPassword.failed')
    showAlert('error', msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

:root {
  --bg-page:     #FDFBF7;
  --bg-card:     #FFFFFF;
  --navy:        #1A2E40;
  --navy-hover:  #152433;
  --text-body:   #2B2B2B;
  --text-muted:  #6C757D;
  --gold:        #D4AF37;
  --mustard:     #E5A93B;
  --burgundy:    #800020;
  --border:      #D8CFC6;
  --input-focus: rgba(26,46,64,0.18);
  --shadow-card: 0 20px 60px rgba(26,46,64,0.14), 0 4px 16px rgba(0,0,0,0.06);
}

.auth-page {
  background-color: var(--bg-page);
  min-height: 100vh;
  padding: 1.5rem;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: var(--bg-card);
  border-radius: 1.25rem !important;
  box-shadow: var(--shadow-card);
  border: 1px solid rgba(216,207,198,0.5);
  padding: 2.5rem 2.25rem;
  animation: cardIn 0.42s cubic-bezier(0.34,1.46,0.64,1) both;
}
@keyframes cardIn {
  from { opacity:0; transform: translateY(24px) scale(0.97); }
  to   { opacity:1; transform: translateY(0)    scale(1);    }
}

.brand-badge {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: #F4EBE1;
  border: 1.5px solid #d4af37;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(212,175,55,0.25);
}
.brand-name { font-size: 0.95rem; color: var(--navy); letter-spacing: 0.01em; }

.lang-toggle {
  display: flex; align-items: center; gap: 5px;
  background: var(--bg-page);
  border: 1.5px solid var(--border);
  border-radius: 2rem;
  padding: 0.3rem 0.75rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--navy);
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  white-space: nowrap;
}
.lang-toggle:hover {
  background: #fff;
  border-color: var(--navy);
  box-shadow: 0 2px 8px rgba(26,46,64,0.14);
}
.lang-icon { opacity: 0.7; flex-shrink: 0; }
.lang-label { line-height: 1; }

.back-link {
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.83rem;
  font-weight: 500;
  transition: color 0.2s;
}
.back-link:hover { color: var(--navy); }
.back-icon { opacity: 0.6; }
[dir="rtl"] .back-icon { transform: scaleX(-1); }

.auth-heading {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-body);
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.25;
}
.auth-subheading { font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; }

.check-email-icon {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: rgba(25,135,84,0.1);
  display: flex; align-items: center; justify-content: center;
}
.check-email-icon img { filter: invert(29%) sepia(60%) saturate(1000%) hue-rotate(100deg); }
.check-email-icon--error { background: rgba(128,0,32,0.08); }
.check-email-icon--error img { filter: invert(9%) sepia(80%) saturate(3000%) hue-rotate(320deg); }

.auth-alert { font-size: 0.85rem; border: 1px solid transparent; }
.auth-alert--success { background: rgba(25,135,84,0.08); border-color: rgba(25,135,84,0.28); color: #0a5c35; }
.auth-alert--error   { background: rgba(128,0,32,0.07);  border-color: rgba(128,0,32,0.28);  color: var(--burgundy); }

.auth-label { font-size: 0.84rem; font-weight: 600; color: var(--text-body); margin-bottom: 0.4rem; }

.input-wrap { position: relative; }
.input-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.4;
  pointer-events: none;
  z-index: 2;
}
[dir="rtl"] .input-icon { left: auto; right: 0.85rem; }
[dir="rtl"] .auth-input { padding-left: 0.9rem; padding-right: 2.5rem; }
[dir="rtl"] .auth-input--eye { padding-right: 2.5rem; padding-left: 2.75rem; }
[dir="rtl"] .eye-btn { right: auto; left: 0.75rem; }

.auth-input {
  height: 46px;
  padding-left: 2.5rem;
  padding-right: 0.9rem;
  border: 1.5px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-body);
  background: #FDFBF7;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.auth-input--eye { padding-right: 2.75rem; }
.auth-input::placeholder { color: #B8AFA6; font-size: 0.875rem; }
.auth-input:focus {
  background: #fff;
  border-color: var(--navy);
  box-shadow: 0 0 0 3px var(--input-focus);
  outline: none;
}
.auth-input.is-invalid { border-color: var(--burgundy); box-shadow: 0 0 0 3px rgba(128,0,32,0.1); }

.invalid-feedback { font-size: 0.78rem; color: var(--burgundy); margin-top: 4px; display: block; }

.eye-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  cursor: pointer; padding: 0.2rem;
  border-radius: 50%; line-height: 0;
  opacity: 0.5; z-index: 3;
  transition: opacity 0.2s, background 0.2s;
}
.eye-btn:hover { opacity: 1; background: rgba(26,46,64,0.07); }

.btn-auth-submit {
  height: 46px;
  background: var(--mustard);
  color: var(--navy);
  border: none;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 14px rgba(229,169,59,0.35);
}
.btn-auth-submit:hover:not(:disabled) {
  background: var(--gold);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(212,175,55,0.45);
}
.btn-auth-submit:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(212,175,55,0.3);
}
.btn-auth-submit:disabled { opacity: 0.65; cursor: not-allowed; }

.alert-fade-enter-active { transition: opacity 0.3s, transform 0.3s; }
.alert-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.alert-fade-enter-from   { opacity:0; transform: translateY(-8px); }
.alert-fade-leave-to     { opacity:0; transform: translateY(-8px); }

@media (max-width: 480px) {
  .auth-card    { padding: 2rem 1.5rem; }
  .auth-heading { font-size: 1.25rem; }
}
</style>
