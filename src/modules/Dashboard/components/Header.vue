<template>
  <header class="border-bottom shadow-sm site-header px-3 px-md-4 py-2" dir="ltr">
    <div class="d-flex align-items-center gap-2 gap-md-3 flex-nowrap">

      <button
        class="btn p-2 rounded-circle border-0 d-flex align-items-center justify-content-center d-md-none menu-toggle-btn flex-shrink-0"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarOffcanvas"
        aria-controls="sidebarOffcanvas"
        :title="t('dashboard.sidebar.title')"
      >
        <img :src="menuIcon" alt="" width="20" height="20" />
      </button>

      <a class="navbar-brand fw-bold fs-5 fs-md-3 text-dark font-serif site-brand mb-0 text-truncate flex-shrink-1">
        <span class="text-warning">📜</span> Dar Al-Hikma
      </a>

      <template v-if="isDashboard && !authStore.isGuest">
        <div class="d-none d-md-flex flex-grow-1 mx-auto search-wrap">
          <div class="input-group">
            <span class="input-group-text bg-white border-end-0 search-icon-wrap">
              <img :src="searchIcon" alt="" width="18" height="18" />
            </span>
            <input
              type="text"
              v-model="searchQuery"
              class="form-control border-start-0 shadow-none search-input"
              :placeholder="t('dashboard.header.searchPlaceholder')"
              :dir="dir"
              @input="onSearchInput"
            />
          </div>
        </div>

        <div class="d-flex d-md-none align-items-center" :class="{ 'flex-grow-1': mobileSearchOpen }">
          <button
            v-if="!mobileSearchOpen"
            type="button"
            class="btn p-2 rounded-circle border-0 d-flex align-items-center justify-content-center icon-btn flex-shrink-0"
            :title="t('dashboard.header.searchPlaceholder')"
            @click="openMobileSearch"
          >
            <img :src="searchIcon" alt="" width="18" height="18" />
          </button>

          <div v-else class="input-group mobile-search-input">
            <span class="input-group-text bg-white border-end-0 search-icon-wrap">
              <img :src="searchIcon" alt="" width="16" height="16" />
            </span>
            <input
              ref="mobileSearchInputRef"
              type="text"
              v-model="searchQuery"
              class="form-control border-start-0 border-end-0 shadow-none search-input"
              :placeholder="t('dashboard.header.searchPlaceholder')"
              :dir="dir"
              @input="onSearchInput"
            />
            <button type="button" class="btn border-start-0 search-close-btn" @click="closeMobileSearch">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </template>

      <div class="d-flex align-items-center gap-2 gap-md-3 ms-auto flex-shrink-0">
        <div class="dropdown">
          <button
            class="btn p-2 rounded-circle border-0 d-none d-md-flex align-items-center justify-content-center icon-btn"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            :title="t('dashboard.header.changeLanguage')"
          >
            <img :src="langIcon" alt="" width="20" height="20" />
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2 lang-dropdown-menu" :dir="dir">
            <li>
              <button type="button" class="dropdown-item" :class="{ active: locale === 'en' }" @click="setLocale('en')">
                English
              </button>
            </li>
            <li>
              <button type="button" class="dropdown-item" :class="{ active: locale === 'ar' }" @click="setLocale('ar')">
                العربية
              </button>
            </li>
          </ul>
        </div>

        <div class="dropdown border-start ps-2 ps-md-3 border-secondary border-opacity-25">
          <button class="btn border-0 p-0 d-flex align-items-center gap-2 user-dropdown-toggle shadow-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <div class="avatar-sm rounded-circle d-flex align-items-center justify-content-center fw-bold">
              {{ userInitial }}
            </div>
            <span class="fw-medium text-dark d-none d-md-block">{{ currentUser.name }}</span>
          </button>

          <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-3 p-3 user-dropdown-menu" :dir="dir">
            <li class="text-center mb-3 mt-2">
              <div class="avatar-lg rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold fs-3 shadow-sm">
                {{ userInitial }}
              </div>
              <h6 class="mb-0 fw-bold">{{ currentUser.name }}</h6>
              <small class="text-muted">{{ currentUser.email }}</small>
            </li>

            <li><hr class="dropdown-divider border-secondary border-opacity-25 my-3"></li>

            <li>
              <button class="dropdown-item py-2 px-3 text-danger rounded transition-all fw-bold text-center" @click="handleLogout">
                {{ t('dashboard.header.logout') }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../Auth/store/authStore'
import { useDashboardStore } from '../store/dashboardStore'
import { debounce } from '@/core/utils/helpers'
import searchIcon from '../../../assets/icons/search.svg'
import langIcon from '../../../assets/icons/language.svg'
import menuIcon from '../../../assets/icons/menu.svg'

const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const dashboardStore = useDashboardStore()

const isDashboard = computed(() => route.name === 'dashboard')

const searchQuery = ref('')
const onSearchInput = debounce(() => {
  dashboardStore.fetchBooks({ search: searchQuery.value || undefined })
}, 1500)

const mobileSearchOpen = ref(false)
const mobileSearchInputRef = ref(null)

async function openMobileSearch() {
  mobileSearchOpen.value = true
  await nextTick()
  mobileSearchInputRef.value?.focus()
}

function closeMobileSearch() {
  mobileSearchOpen.value = false
  searchQuery.value = ''
  dashboardStore.fetchBooks()
}

function setLocale(lang) {
  locale.value = lang
  localStorage.setItem('lms_lang', lang)
}

const currentUser = computed(() => ({
  name:  authStore.user?.name  ?? 'User',
  email: authStore.user?.email ?? ''
}))

const userInitial = computed(() => {
  return currentUser.value.name ? currentUser.value.name.charAt(0).toUpperCase() : 'U'
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/auth')
}
</script>

<style scoped>
.site-header {
  background-color: var(--bg-page);
  border-bottom-color: var(--border) !important;
}

.site-brand {
  font-family: Georgia, serif;
  color: var(--navy) !important;
  max-width: 40vw;
}

.menu-toggle-btn {
  background-color: var(--gold-tint);
}

.search-wrap {
  max-width: 480px;
  min-width: 0;
}

.search-icon-wrap {
  border-color: var(--border);
}

.search-input {
  border-color: var(--border);
  background-color: #fff;
}

.mobile-search-input {
  width: 100%;
}

.search-close-btn {
  border-color: var(--border);
  background-color: #fff;
  color: var(--text-muted);
  display: flex;
  align-items: center;
}

.search-close-btn:hover {
  color: var(--navy);
  background-color: var(--gold-tint);
}

.icon-btn {
  background-color: var(--gold-tint);
  width: 38px;
  height: 38px;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background-color: var(--border);
  transform: scale(1.05);
}

.avatar-sm {
  width: 36px;
  height: 36px;
  background-color: var(--navy);
  color: var(--gold);
  border: 1.5px solid var(--gold);
  font-size: 1.1rem;
}

.avatar-lg {
  width: 72px;
  height: 72px;
  background-color: var(--navy);
  color: var(--gold);
  border: 2px solid var(--gold);
}

.user-dropdown-toggle {
  transition: opacity 0.2s;
}

.user-dropdown-toggle:hover {
  opacity: 0.85;
}

.user-dropdown-toggle::after {
  display: none;
}

.user-dropdown-menu {
  width: 260px;
  background-color: var(--bg-page);
  border: 1px solid var(--border) !important;
  border-radius: 12px;
}

.lang-dropdown-menu {
  min-width: 140px;
  background-color: var(--bg-page);
  border: 1px solid var(--border) !important;
  border-radius: 10px;
}

.dropdown-item.active,
.dropdown-item:active {
  background-color: var(--gold-tint) !important;
  color: var(--navy) !important;
}

.dropdown-item {
  font-weight: 500;
  color: var(--wood);
}

.dropdown-item:hover {
  background-color: var(--gold-tint);
  color: var(--navy);
}

.dropdown-item.text-danger:hover {
  background-color: rgba(128, 0, 32, 0.08);
  color: var(--burgundy) !important;
}

@media (max-width: 575.98px) {
  .site-brand {
    font-size: 1.1rem !important;
    max-width: 45vw;
  }
}
</style>
