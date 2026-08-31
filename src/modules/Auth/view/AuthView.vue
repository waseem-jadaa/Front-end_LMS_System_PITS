<template>

  <div class="auth-page d-flex align-items-center justify-content-center min-vh-100">

    <div class="auth-card d-flex rounded-4 overflow-hidden shadow-lg">

      <div class="auth-image-panel d-none d-lg-flex">
        <img :src="authHeroImg" alt="Book Tree – Dar al-Hikma Library" class="auth-hero-img" />
        <div class="image-overlay"></div>
      </div>

      <div
        class="auth-form-panel d-flex flex-column justify-content-center"
        :dir="dir"
      >

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

        <transition name="heading-fade" mode="out-in">
          <div :key="activeTab + locale">
            <h2 class="auth-heading mb-1">
              {{ activeTab === 'signin' ? t('auth.signin.heading') : t('auth.signup.heading') }}
            </h2>
            <p class="auth-subheading mb-4">
              {{ activeTab === 'signin' ? t('auth.signin.subheading') : t('auth.signup.subheading') }}
            </p>
          </div>
        </transition>

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

        <transition name="form-slide" mode="out-in">
          <form v-if="activeTab === 'signin'" key="signin" novalidate @submit.prevent="handleSignIn">

            <div class="mb-3">
              <label for="si-email" class="form-label auth-label">{{ t('auth.fields.emailOrUsername') }}</label>
              <div class="input-wrap position-relative">
                <img :src="mailSvg" alt="" class="input-icon" width="16" height="16" />
                <input
                  id="si-email"
                  v-model.trim="signIn.email"
                  type="email"
                  class="form-control auth-input"
                  :class="{ 'is-invalid': signInErrors.email }"
                  :placeholder="t('auth.fields.emailOrUsernamePlaceholder')"
                  autocomplete="email"
                />
                <div v-if="signInErrors.email" class="invalid-feedback">{{ signInErrors.email }}</div>
              </div>
            </div>

            <div class="mb-3">
              <label for="si-password" class="form-label auth-label">{{ t('auth.fields.password') }}</label>
              <div class="input-wrap position-relative">
                <img :src="lockSvg" alt="" class="input-icon" width="16" height="16" />
                <input
                  id="si-password"
                  v-model="signIn.password"
                  :type="showSiPassword ? 'text' : 'password'"
                  class="form-control auth-input auth-input--eye"
                  :class="{ 'is-invalid': signInErrors.password }"
                  :placeholder="t('auth.fields.currentPasswordPlaceholder')"
                  autocomplete="current-password"
                />
                <button type="button" class="eye-btn" @click="showSiPassword = !showSiPassword"
                  :aria-label="showSiPassword ? 'Hide' : 'Show'">
                  <img :src="showSiPassword ? eyeSvg : eyeOffSvg" alt="" width="18" height="18" />
                </button>
                <div v-if="signInErrors.password" class="invalid-feedback">{{ signInErrors.password }}</div>
              </div>
            </div>

            <div class="d-flex align-items-center justify-content-between mb-4">
              <div class="form-check mb-0">
                <input class="form-check-input auth-checkbox" type="checkbox" id="rememberMe" v-model="signIn.rememberMe" />
                <label class="form-check-label small text-secondary" for="rememberMe">
                  {{ t('auth.fields.rememberMe') }}
                </label>
              </div>
              <a href="#" class="forgot-link small">{{ t('auth.links.forgotPassword') }}</a>
            </div>

            <button type="submit" class="btn-auth-submit w-100 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2" :disabled="signInLoading">
              <span v-if="signInLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span>{{ signInLoading ? t('auth.buttons.loggingIn') : t('auth.buttons.login') }}</span>
            </button>
          </form>

          <form v-else key="signup" novalidate @submit.prevent="handleSignUp">

            <div class="mb-3">
              <label for="su-name" class="form-label auth-label">{{ t('auth.fields.fullName') }}</label>
              <div class="input-wrap position-relative">
                <img :src="userSvg" alt="" class="input-icon" width="16" height="16" />
                <input
                  id="su-name"
                  v-model.trim="signUp.name"
                  type="text"
                  class="form-control auth-input"
                  :class="{ 'is-invalid': signUpErrors.name }"
                  :placeholder="t('auth.fields.fullNamePlaceholder')"
                  autocomplete="name"
                />
                <div v-if="signUpErrors.name" class="invalid-feedback">{{ signUpErrors.name }}</div>
              </div>
            </div>

            <div class="mb-3">
              <label for="su-email" class="form-label auth-label">{{ t('auth.fields.email') }}</label>
              <div class="input-wrap position-relative">
                <img :src="mailSvg" alt="" class="input-icon" width="16" height="16" />
                <input
                  id="su-email"
                  v-model.trim="signUp.email"
                  type="email"
                  class="form-control auth-input"
                  :class="{ 'is-invalid': signUpErrors.email }"
                  :placeholder="t('auth.fields.emailPlaceholder')"
                  autocomplete="email"
                />
                <div v-if="signUpErrors.email" class="invalid-feedback">{{ signUpErrors.email }}</div>
              </div>
            </div>

            <div class="mb-2">
              <label for="su-password" class="form-label auth-label">{{ t('auth.fields.password') }}</label>
              <div class="input-wrap position-relative">
                <img :src="lockSvg" alt="" class="input-icon" width="16" height="16" />
                <input
                  id="su-password"
                  v-model="signUp.password"
                  :type="showSuPassword ? 'text' : 'password'"
                  class="form-control auth-input auth-input--eye"
                  :class="{ 'is-invalid': signUpErrors.password, 'is-valid': signUp.password && passwordStrength.valid }"
                  :placeholder="t('auth.fields.passwordPlaceholder')"
                  autocomplete="new-password"
                />
                <button type="button" class="eye-btn" @click="showSuPassword = !showSuPassword" :aria-label="showSuPassword ? 'Hide' : 'Show'">
                  <img :src="showSuPassword ? eyeSvg : eyeOffSvg" alt="" width="18" height="18" />
                </button>
                <div v-if="signUpErrors.password" class="invalid-feedback">{{ signUpErrors.password }}</div>
              </div>

              <div v-if="signUp.password" class="strength-wrap mt-2 d-flex align-items-center gap-1">
                <div v-for="n in 4" :key="n" class="strength-seg" :class="n <= passwordStrength.score ? `seg-${passwordStrength.level}` : ''"></div>
                <span class="ms-2 small" :class="`clr-${passwordStrength.level}`">{{ passwordStrength.label }}</span>
              </div>
            </div>

            <div class="mb-4">
              <label for="su-confirm" class="form-label auth-label">{{ t('auth.fields.confirmPassword') }}</label>
              <div class="input-wrap position-relative">
                <img :src="shieldCheckSvg" alt="" class="input-icon" width="16" height="16" />
                <input
                  id="su-confirm"
                  v-model="signUp.password_confirmation"
                  :type="showSuConfirm ? 'text' : 'password'"
                  class="form-control auth-input auth-input--eye"
                  :class="{
                    'is-invalid': signUpErrors.password_confirmation,
                    'is-valid': signUp.password_confirmation && signUp.password === signUp.password_confirmation
                  }"
                  :placeholder="t('auth.fields.confirmPasswordPlaceholder')"
                  autocomplete="new-password"
                />
                <button type="button" class="eye-btn" @click="showSuConfirm = !showSuConfirm" :aria-label="showSuConfirm ? 'Hide' : 'Show'">
                  <img :src="showSuConfirm ? eyeSvg : eyeOffSvg" alt="" width="18" height="18" />
                </button>
                <div v-if="signUpErrors.password_confirmation" class="invalid-feedback">{{ signUpErrors.password_confirmation }}</div>
                <div v-if="signUp.password_confirmation && signUp.password === signUp.password_confirmation && !signUpErrors.password_confirmation" class="valid-feedback">
                  {{ t('auth.validation.passwordsMatch') }}
                </div>
              </div>
            </div>

            <button type="submit" class="btn-auth-submit w-100 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2" :disabled="signUpLoading">
              <span v-if="signUpLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span>{{ signUpLoading ? t('auth.buttons.creatingAccount') : t('auth.buttons.createAccount') }}</span>
            </button>
          </form>
        </transition>

        <p class="switch-link text-center mt-4 mb-0 small">
          <template v-if="activeTab === 'signin'">
            {{ t('auth.links.newUser') }}&nbsp;
            <a href="#" class="create-link fw-semibold" @click.prevent="switchTab('signup')">{{ t('auth.links.createAccount') }}</a>
          </template>
          <template v-else>
            {{ t('auth.links.existingUser') }}&nbsp;
            <a href="#" class="create-link fw-semibold" @click.prevent="switchTab('signin')">{{ t('auth.links.signin') }}</a>
          </template>
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'

import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
function toggleLang() {
  locale.value = locale.value === 'en' ? 'ar' : 'en'
  localStorage.setItem('lms_lang', locale.value)
}

import authHeroImg    from '../../../assets/auth-hero.webp'
import bookOpenSvg    from '../../../assets/icons/book-open.svg'
import languageSvg    from '../../../assets/icons/language.svg'
import mailSvg        from '../../../assets/icons/mail.svg'
import lockSvg        from '../../../assets/icons/lock.svg'
import eyeSvg         from '../../../assets/icons/eye.svg'
import eyeOffSvg      from '../../../assets/icons/eye-off.svg'
import userSvg        from '../../../assets/icons/user.svg'
import shieldCheckSvg from '../../../assets/icons/shield-check.svg'
import checkCircleSvg from '../../../assets/icons/check-circle.svg'
import alertCircleSvg from '../../../assets/icons/alert-circle.svg'

const router = useRouter()

const activeTab = ref('signin')
function switchTab(tab) { activeTab.value = tab; dismissAlert(); clearErrors() }

const showSiPassword = ref(false)
const showSuPassword = ref(false)
const showSuConfirm  = ref(false)

const alert = reactive({ show: false, type: 'success', message: '' })
function showAlert(type, message) { alert.show = true; alert.type = type; alert.message = message }
function dismissAlert() { alert.show = false; alert.message = '' }

const signInLoading = ref(false)
const signUpLoading = ref(false)

const signIn = reactive({ email: '', password: '', rememberMe: false })
const signUp = reactive({ name: '', email: '', password: '', password_confirmation: '' })

const signInErrors = reactive({ email: '', password: '' })
const signUpErrors = reactive({ name: '', email: '', password: '', password_confirmation: '' })
function clearErrors() {
  Object.keys(signInErrors).forEach(k => (signInErrors[k] = ''))
  Object.keys(signUpErrors).forEach(k => (signUpErrors[k] = ''))
}

const passwordStrength = computed(() => {
  const p = signUp.password
  if (!p) return { score: 0, level: 'weak', label: '', valid: false }
  let score = 0
  if (p.length >= 8)           score++
  if (/[A-Z]/.test(p))         score++
  if (/[0-9]/.test(p))         score++
  if (/[^A-Za-z0-9]/.test(p))  score++
  const levels = ['', 'weak', 'fair', 'good', 'strong']
  const keys   = ['', 'auth.strength.weak', 'auth.strength.fair', 'auth.strength.good', 'auth.strength.strong']
  const level  = levels[score] || 'weak'
  return { score, level, label: score > 0 ? t(keys[score]) : '', valid: score >= 2 }
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateSignIn() {
  clearErrors(); let ok = true
  if (!signIn.email)                     { signInErrors.email    = t('auth.validation.emailRequired');    ok = false }
  else if (!EMAIL_RE.test(signIn.email)) { signInErrors.email    = t('auth.validation.emailInvalid');     ok = false }
  if (!signIn.password)                  { signInErrors.password = t('auth.validation.passwordRequired'); ok = false }
  return ok
}

function validateSignUp() {
  clearErrors(); let ok = true
  if (!signUp.name.trim())               { signUpErrors.name     = t('auth.validation.nameRequired');          ok = false }
  if (!signUp.email)                     { signUpErrors.email    = t('auth.validation.emailRequired');          ok = false }
  else if (!EMAIL_RE.test(signUp.email)) { signUpErrors.email    = t('auth.validation.emailInvalid');           ok = false }
  if (!signUp.password)                  { signUpErrors.password = t('auth.validation.passwordRequired');       ok = false }
  else if (signUp.password.length < 8)   { signUpErrors.password = t('auth.validation.passwordMin');            ok = false }
  if (!signUp.password_confirmation)     { signUpErrors.password_confirmation = t('auth.validation.confirmRequired');   ok = false }
  else if (signUp.password !== signUp.password_confirmation) {
    signUpErrors.password_confirmation = t('auth.validation.passwordsMismatch'); ok = false
  }
  return ok
}

async function handleSignIn() {
  if (!validateSignIn()) return
  dismissAlert(); signInLoading.value = true
  try {
    const data = await authService.login({ email: signIn.email, password: signIn.password })
    if (data.data?.token) localStorage.setItem('auth_token', data.data.token)
    if (data.data?.user)  localStorage.setItem('auth_user',  JSON.stringify(data.data.user))
    showAlert('success', data.message || t('auth.messages.loginSuccess'))
    setTimeout(() => router.push({ name: 'dashboard' }), 900)
  } catch (err) {
    const msg = err?.response?.data?.message || t('auth.messages.loginFailed')
    const errors = err?.response?.data?.errors
    if (errors) Object.entries(errors).forEach(([f, m]) => { if (f in signInErrors) signInErrors[f] = Array.isArray(m) ? m[0] : m })
    showAlert('error', msg)
  } finally { signInLoading.value = false }
}

async function handleSignUp() {
  if (!validateSignUp()) return
  dismissAlert(); signUpLoading.value = true
  try {
    const data = await authService.register({ name: signUp.name, email: signUp.email, password: signUp.password, password_confirmation: signUp.password_confirmation })
    showAlert('success', data.message || t('auth.messages.registerSuccess'))
    Object.assign(signUp, { name: '', email: '', password: '', password_confirmation: '' })
    setTimeout(() => switchTab('signin'), 1600)
  } catch (err) {
    const msg = err?.response?.data?.message || t('auth.messages.registerFailed')
    const errors = err?.response?.data?.errors
    if (errors) Object.entries(errors).forEach(([f, m]) => { if (f in signUpErrors) signUpErrors[f] = Array.isArray(m) ? m[0] : m })
    showAlert('error', msg)
  } finally { signUpLoading.value = false }
}
</script>

<style scoped>

:root {
  --bg-page:     #FDFBF7;
  --bg-card:     #FFFFFF;
  --navy:        #1A2E40;
  --navy-hover:  #152433;
  --sage:        #607A66;
  --wood:        #4A3728;
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
  max-width: 920px;
  min-height: 560px;
  background: var(--bg-card);
  border-radius: 1.25rem !important;
  box-shadow: var(--shadow-card);
  border: 1px solid rgba(216,207,198,0.5);
  animation: cardIn 0.42s cubic-bezier(0.34,1.46,0.64,1) both;
}
@keyframes cardIn {
  from { opacity:0; transform: translateY(24px) scale(0.97); }
  to   { opacity:1; transform: translateY(0)    scale(1);    }
}

.auth-image-panel {
  position: relative;
  width: 52%;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 1.25rem 0 0 1.25rem;
  background: #f7f4ef; 
}
.auth-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}
.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 55%, rgba(26,46,64,0.18) 100%);
  pointer-events: none;
}

.auth-form-panel {
  flex: 1;
  padding: 2.75rem 2.5rem;
  min-width: 0;
  background: #fff;
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
.brand-badge img { filter: none; }
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

.auth-heading {
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--text-body);
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.25;
}
.auth-subheading { font-size: 0.875rem; color: var(--text-muted); line-height: 1.5; }

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
.auth-input.is-valid  { border-color: #198754; box-shadow: 0 0 0 3px rgba(25,135,84,0.12); }
.auth-input.is-invalid { border-color: var(--burgundy); box-shadow: 0 0 0 3px rgba(128,0,32,0.1); }

.invalid-feedback { font-size: 0.78rem; color: var(--burgundy); margin-top: 4px; display: block; }
.valid-feedback   { font-size: 0.78rem; color: #198754;         margin-top: 4px; display: block; }

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

.auth-checkbox { border-color: var(--border); cursor: pointer; }
.auth-checkbox:checked { background-color: var(--navy); border-color: var(--navy); }
.auth-checkbox:focus { box-shadow: 0 0 0 3px var(--input-focus); }

.forgot-link { color: var(--navy); text-decoration: none; font-weight: 500; transition: color 0.2s; }
.forgot-link:hover { color: var(--mustard); text-decoration: underline; }
.switch-link { color: var(--text-muted); }
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

.strength-wrap { display: flex; align-items: center; }
.strength-seg { height: 4px; flex: 1; border-radius: 99px; background: #E8E2DC; transition: background 0.3s; }
.strength-seg.seg-weak   { background: var(--burgundy); }
.strength-seg.seg-fair   { background: var(--mustard);  }
.strength-seg.seg-good   { background: var(--gold);     }
.strength-seg.seg-strong { background: #198754;         }
.clr-weak   { color: var(--burgundy); font-size: 0.73rem; }
.clr-fair   { color: var(--mustard);  font-size: 0.73rem; }
.clr-good   { color: #b8860b;         font-size: 0.73rem; }
.clr-strong { color: #198754;         font-size: 0.73rem; }

.heading-fade-enter-active { transition: opacity 0.25s, transform 0.25s; }
.heading-fade-leave-active { transition: opacity 0.18s, transform 0.18s; }
.heading-fade-enter-from   { opacity:0; transform: translateY(-6px); }
.heading-fade-leave-to     { opacity:0; transform: translateY(6px);  }

.alert-fade-enter-active { transition: opacity 0.3s, transform 0.3s; }
.alert-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.alert-fade-enter-from   { opacity:0; transform: translateY(-8px); }
.alert-fade-leave-to     { opacity:0; transform: translateY(-8px); }

.form-slide-enter-active { transition: opacity 0.28s, transform 0.28s; }
.form-slide-leave-active { transition: opacity 0.2s,  transform 0.2s;  }
.form-slide-enter-from   { opacity:0; transform: translateX(20px);  }
.form-slide-leave-to     { opacity:0; transform: translateX(-20px); }

@media (max-width: 991px) {
  .auth-card       { max-width: 480px; }
  .auth-form-panel { padding: 2.25rem 2rem; }
}
@media (max-width: 480px) {
  .auth-form-panel { padding: 2rem 1.5rem; }
  .auth-heading    { font-size: 1.3rem; }
}
</style>
