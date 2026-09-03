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

      <router-link
        :to="{ name: 'auth' }"
        class="back-link d-inline-flex align-items-center justify-content-center mb-3"
        :aria-label="t('auth.forgotPassword.backToLogin')"
        :title="t('auth.forgotPassword.backToLogin')"
      >
        <svg class="back-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </router-link>

      <template v-if="!submitted">
        <h2 class="auth-heading mb-1">{{ t('auth.forgotPassword.heading') }}</h2>
        <p class="auth-subheading mb-4">{{ t('auth.forgotPassword.subheading') }}</p>

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
          <div class="mb-4">
            <label for="fp-email" class="form-label auth-label">{{ t('auth.fields.email') }}</label>
            <div class="input-wrap position-relative">
              <img :src="mailSvg" alt="" class="input-icon" width="16" height="16" />
              <input
                id="fp-email"
                v-model.trim="email"
                type="email"
                class="form-control auth-input"
                :class="{ 'is-invalid': emailError }"
                :placeholder="t('auth.fields.emailPlaceholder')"
                autocomplete="email"
              />
              <div v-if="emailError" class="invalid-feedback">{{ emailError }}</div>
            </div>
          </div>

          <button type="submit" class="btn-auth-submit w-100 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            <span>{{ loading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.button') }}</span>
          </button>
        </form>
      </template>

      <template v-else>
        <div class="check-email-icon mb-3">
          <img :src="checkCircleSvg" alt="" width="28" height="28" />
        </div>
        <h2 class="auth-heading mb-1">{{ t('auth.forgotPassword.checkEmailHeading') }}</h2>
        <p class="auth-subheading mb-4">{{ t('auth.forgotPassword.checkEmailText', { email: sentTo }) }}</p>

        <a href="#" class="create-link fw-semibold small" @click.prevent="resend">{{ t('auth.forgotPassword.resendLink') }}</a>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../store/authStore'

import bookOpenSvg     from '../../../assets/icons/book-open.svg'
import languageSvg     from '../../../assets/icons/language.svg'
import mailSvg         from '../../../assets/icons/mail.svg'
import checkCircleSvg  from '../../../assets/icons/check-circle.svg'
import alertCircleSvg  from '../../../assets/icons/alert-circle.svg'

const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
function toggleLang() {
  locale.value = locale.value === 'en' ? 'ar' : 'en'
  localStorage.setItem('lms_lang', locale.value)
}

const authStore = useAuthStore()

const email      = ref('')
const emailError = ref('')
const loading     = ref(false)
const submitted   = ref(false)
const sentTo       = ref('')

const alert = reactive({ show: false, type: 'success', message: '' })
function showAlert(type, message) { alert.show = true; alert.type = type; alert.message = message }
function dismissAlert() { alert.show = false; alert.message = '' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  emailError.value = ''
  if (!email.value)                     { emailError.value = t('auth.validation.emailRequired'); return false }
  if (!EMAIL_RE.test(email.value))      { emailError.value = t('auth.validation.emailInvalid');   return false }
  return true
}

async function handleSubmit() {
  if (!validate()) return
  dismissAlert(); loading.value = true
  try {
    await authStore.forgotPassword({ email: email.value })
    sentTo.value = email.value
    submitted.value = true
  } catch (err) {
    const msg = err?.response?.data?.message || t('auth.forgotPassword.failed')
    showAlert('error', msg)
  } finally {
    loading.value = false
  }
}

function resend() {
  submitted.value = false
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
  color: var(--gold);
  text-decoration: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: color 0.2s, background-color 0.2s;
}
.back-link:hover { color: var(--mustard); background-color: rgba(212,175,55,0.12); }
.back-icon { display: block; }
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
.auth-input::placeholder { color: #B8AFA6; font-size: 0.875rem; }
.auth-input:focus {
  background: #fff;
  border-color: var(--navy);
  box-shadow: 0 0 0 3px var(--input-focus);
  outline: none;
}
.auth-input.is-invalid { border-color: var(--burgundy); box-shadow: 0 0 0 3px rgba(128,0,32,0.1); }

.invalid-feedback { font-size: 0.78rem; color: var(--burgundy); margin-top: 4px; display: block; }

.create-link { color: var(--navy); text-decoration: none; transition: color 0.2s; }
.create-link:hover { color: var(--mustard); text-decoration: underline; }

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
