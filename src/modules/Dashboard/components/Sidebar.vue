<template>
  <div
    class="offcanvas-md offcanvas-start sidebar-nav text-white shadow-sm"
    :class="{ 'sidebar-collapsed': collapsed }"
    tabindex="-1"
    id="sidebarOffcanvas"
  >
    <div class="offcanvas-header d-md-none border-bottom border-secondary border-opacity-25">
      <h5 class="offcanvas-title font-serif text-white m-2 " :dir="dir">{{ t('dashboard.sidebar.title') }}</h5>
      <div class="d-flex align-items-center gap-4 m-2">
        <div class="dropdown">
          <button
            class="btn p-2 rounded-circle border-0 d-flex align-items-center justify-content-center mobile-icon-btn"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            :title="t('dashboard.header.changeLanguage')"
          >
            <img :src="langIcon" alt="" width="18" height="18" />
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

        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" data-bs-target="#sidebarOffcanvas" aria-label="Close"></button>
      </div>
    </div>

    <div class="offcanvas-body d-flex flex-column p-3">
      <div class="d-none d-md-flex align-items-center py-3 mb-3 border-bottom border-secondary border-opacity-50 sidebar-head">
        <h5 class="font-serif text-white tracking-wide sidebar-title mb-0 flex-grow-1 text-center" :dir="dir">
          {{ collapsed ? '' : t('dashboard.sidebar.title') }}
        </h5>
        <button
          type="button"
          class="btn p-1 rounded-circle border-0 d-flex align-items-center justify-content-center collapse-toggle-btn flex-shrink-0"
          @click="collapsed = !collapsed"
          :title="collapsed ? t('dashboard.sidebar.expand') : t('dashboard.sidebar.collapse')"
        >
          <img :src="chevronIcon" alt="" width="16" height="16" class="collapse-toggle-icon" />
        </button>
      </div>

      <ul class="nav flex-column mt-md-0 gap-3">
        <li class="nav-item">
          <router-link to="/" class="nav-link text-white py-3 px-4 rounded-pill d-flex align-items-center transition-all" :title="collapsed ? t('dashboard.sidebar.home') : null">
            <img :src="homeIcon" alt="" width="20" height="20" class="nav-icon" /> <span class="fw-medium nav-label">{{ t('dashboard.sidebar.home') }}</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="!authStore.isGuest">
          <router-link to="/books" class="nav-link text-white py-3 px-4 rounded-pill d-flex align-items-center transition-all" :title="collapsed ? t('dashboard.sidebar.books') : null">
            <img :src="bookIcon" alt="" width="20" height="20" class="nav-icon" /> <span class="fw-medium nav-label">{{ t('dashboard.sidebar.books') }}</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="authStore.isAdmin">
          <router-link to="/members" class="nav-link text-white py-3 px-4 rounded-pill d-flex align-items-center transition-all" :title="collapsed ? t('dashboard.sidebar.members') : null">
            <img :src="usersIcon" alt="" width="20" height="20" class="nav-icon" /> <span class="fw-medium nav-label">{{ t('dashboard.sidebar.members') }}</span>
          </router-link>
        </li>
        <li class="nav-item" v-if="!authStore.isGuest">
          <router-link to="/borrowings" class="nav-link text-white py-3 px-4 rounded-pill d-flex align-items-center transition-all" :title="collapsed ? t('dashboard.sidebar.borrowings') : null">
            <img :src="fileTextIcon" alt="" width="20" height="20" class="nav-icon" /> <span class="fw-medium nav-label">{{ t('dashboard.sidebar.borrowings') }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../Auth/store/authStore'
import homeIcon      from '../../../assets/icons/home.svg'
import bookIcon       from '../../../assets/icons/book.svg'
import usersIcon      from '../../../assets/icons/users.svg'
import fileTextIcon   from '../../../assets/icons/file-text.svg'
import chevronIcon    from '../../../assets/icons/chevron-left.svg'
import langIcon       from '../../../assets/icons/language.svg'

const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const collapsed = ref(false)
const authStore = useAuthStore()

function setLocale(lang) {
  locale.value = lang
  localStorage.setItem('lms_lang', lang)
}
</script>

<style scoped>
.sidebar-nav {
  --bs-offcanvas-width: 260px;
  --bs-offcanvas-bg: var(--navy);
  background-color: var(--navy) !important;
}

@media (min-width: 768px) {
  .sidebar-nav {
    width: 260px;
    min-height: 100%;
    background-color: var(--navy) !important;
    transition: width 0.25s ease;
    flex-shrink: 0;
  }

  .sidebar-nav.sidebar-collapsed {
    width: 88px;
  }

  .sidebar-nav .offcanvas-body {
    padding: 0.75rem !important;
  }
}

.sidebar-title {
  font-family: Georgia, serif;
  letter-spacing: 1px;
  white-space: nowrap;
  overflow: hidden;
}

.collapse-toggle-btn {
  width: 28px;
  height: 28px;
  background-color: rgba(255, 255, 255, 0.08);
}

.collapse-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.16);
}

.mobile-icon-btn {
  width: 34px;
  height: 34px;
  background-color: rgba(255, 255, 255, 0.08);
}

.mobile-icon-btn img {
  filter: brightness(0) invert(1);
}

.mobile-icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.16);
}

.lang-dropdown-menu {
  min-width: 140px;
  background-color: var(--bg-page);
  border: 1px solid var(--border) !important;
  border-radius: 10px;
}

.lang-dropdown-menu .dropdown-item {
  font-weight: 500;
  color: var(--wood);
}

.lang-dropdown-menu .dropdown-item:hover {
  background-color: var(--gold-tint);
  color: var(--navy);
}

.lang-dropdown-menu .dropdown-item.active,
.lang-dropdown-menu .dropdown-item:active {
  background-color: var(--gold-tint) !important;
  color: var(--navy) !important;
}

.collapse-toggle-icon {
  transition: transform 0.25s ease;
}

.sidebar-collapsed .collapse-toggle-icon {
  transform: rotate(180deg);
}

.sidebar-collapsed .sidebar-head {
  justify-content: center;
}

.sidebar-nav .nav {
  padding-inline-start: 0;
}

.nav-link {
  background-color: transparent;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.nav-icon {
  flex-shrink: 0;
  margin-inline-end: 0.75rem;
}

.nav-label {
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-collapsed .nav-link {
  flex-direction: row !important;
  justify-content: center !important;
  padding-inline: 0.5rem !important;
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}

.sidebar-collapsed .nav-icon {
  margin-inline: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.sidebar-collapsed .nav-label {
  display: none;
}

.nav-link:hover {
  background-color: var(--navy-hover);
  color: var(--gold-tint) !important;
  border-color: rgba(212, 175, 55, 0.3);
}

.router-link-active {
  background-color: var(--navy-hover) !important;
  color: var(--gold) !important;
  border: 1px solid var(--gold);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}
</style>
