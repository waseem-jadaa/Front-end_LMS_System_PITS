<template>
  <div class="container-fluid p-0 dashboard-layout" :dir="dir">
    <Header />

    <div class="d-flex dashboard-body">
      <Sidebar />

      <div class="flex-grow-1 p-3 p-md-4" dir="ltr">

        <div class="row align-items-center p-3 p-md-4 rounded-4 shadow-sm mb-4 mb-md-5 hero-card">
          <div class="col-lg-7" :dir="dir">
            <span class="badge mb-2 text-dark hero-badge">{{ t('dashboard.hero.badge') }}</span>
            <h1 class="fw-bold font-serif mb-3 hero-title">{{ t('dashboard.hero.title') }}</h1>
            <p class="text-secondary mb-4 hero-text">
              {{ t('dashboard.hero.text') }}
            </p>
            <div v-if="isAdmin" class="d-flex flex-wrap gap-3">
              <div class="bg-white px-3 py-2 rounded shadow-sm border stat-card">
                <span class="d-block text-muted small">{{ t('dashboard.hero.totalBooks') }}</span>
                <strong class="fs-5 stat-value">{{ store.statsLoading ? '—' : (store.totalBooks ?? '—') }}</strong>
              </div>
              <div class="bg-white px-3 py-2 rounded shadow-sm border stat-card">
                <span class="d-block text-muted small">{{ t('dashboard.hero.activeMembers') }}</span>
                <strong class="fs-5 stat-value">{{ store.statsLoading ? '—' : (store.activeMembers ?? '—') }}</strong>
              </div>
            </div>
          </div>
          <div class="col-lg-5 text-center mt-4 mt-lg-0">
            <div class="p-3 bg-white rounded-4 shadow-sm border hero-image-outer">
              <div class="rounded-4 overflow-hidden shadow-sm border hero-image-inner">
                <img :src="libraryHeroImg" alt="Dar Al-Hikma Library" class="w-100 h-100 object-fit-cover" />
              </div>
            </div>
          </div>
        </div>

        <template v-if="!authStore.isGuest">
          <h3 class="fw-bold font-serif mb-4 section-title" :dir="dir">📚 {{ t('dashboard.sections.featured') }}</h3>

          <div v-if="store.booksLoading" class="row g-4 mb-4">
            <div class="col-12 col-sm-6 col-lg-4" v-for="n in 3" :key="n">
              <div class="skeleton-card rounded-4"></div>
            </div>
          </div>

          <p v-else-if="!store.books.length" class="text-muted small mb-4" :dir="dir">{{ t('dashboard.sections.empty') }}</p>

          <div v-else class="row g-4 mb-4">
            <div class="col-12 col-sm-6 col-lg-4" v-for="book in store.books" :key="book.id">
              <div class="card h-100 border-0 shadow-sm rounded-4 p-3 book-card">
                <div class="d-flex gap-3">
                  <div class="rounded p-3 text-white d-flex align-items-center justify-content-center book-cover-placeholder flex-shrink-0">
                    <span class="small text-center">{{ t('dashboard.bookCard.placeholder') }}</span>
                  </div>
                  <div class="book-info">
                    <span class="badge bg-light text-dark border mb-1 book-category">{{ book.category }}</span>
                    <h6 class="fw-bold mb-1 book-title text-truncate">{{ book.title }}</h6>
                    <p class="text-muted small mb-0 text-truncate">{{ book.author }} • {{ book.publish_year }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Header from '../components/Header.vue'
import Sidebar from '../components/Sidebar.vue'
import Footer from '../components/Footer.vue'
import { useAuthStore } from '@/modules/Auth/store/authStore'
import { useDashboardStore } from '../store/dashboardStore'
import libraryHeroImg from '../../../assets/library-hero.webp'

const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)
const store = useDashboardStore()

onMounted(() => {
  if (isAdmin.value) store.fetchStats()
  if (!authStore.isGuest) store.fetchBooks()
})
</script>

<style scoped>
.dashboard-layout {
  background-color: var(--bg-page);
  min-height: 100vh;
  overflow-x: hidden;
}

.dashboard-body {
  min-height: calc(100vh - 68px);
  min-width: 0;
}

.dashboard-body > .flex-grow-1 {
  min-width: 0;
}

.hero-card {
  background-color: var(--gold-tint);
  border: 1px solid var(--border);
}

.hero-badge {
  background-color: var(--gold);
}

.hero-title,
.section-title {
  font-family: Georgia, serif;
  color: var(--navy);
}

.hero-title {
  font-size: 1.75rem;
}

.hero-text {
  line-height: 1.8;
}

.stat-card {
  border-color: var(--border) !important;
}

.stat-value {
  color: var(--navy);
}

.hero-image-outer {
  border-color: var(--border) !important;
}

.hero-image-inner {
  border-color: var(--border) !important;
  max-height: 220px;
}

.book-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border) !important;
}

.book-cover-placeholder {
  width: 75px;
  height: 100px;
  background-color: var(--navy);
}

.book-info {
  min-width: 0;
}

.book-category {
  font-size: 10px;
  border-color: var(--border) !important;
}

.book-title {
  color: var(--navy);
}

.skeleton-card {
  height: 132px;
  background: linear-gradient(90deg, var(--bg-card) 25%, var(--gold-tint) 37%, var(--bg-card) 63%);
  background-size: 400% 100%;
  animation: skeleton-shimmer 1.4s ease infinite;
  border: 1px solid var(--border);
}

@keyframes skeleton-shimmer {
  0%   { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

@media (max-width: 991.98px) {
  .hero-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 575.98px) {
  .hero-title {
    font-size: 1.3rem;
  }

  .stat-card {
    flex: 1 1 auto;
  }
}
</style>
