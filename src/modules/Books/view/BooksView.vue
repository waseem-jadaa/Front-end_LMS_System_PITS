<template>
  <div class="container-fluid p-0 books-layout" :dir="dir">
    <Header />

    <div class="d-flex books-body">
      <Sidebar />

      <div class="flex-grow-1 p-3 p-md-4" dir="ltr">

        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3 p-md-4 rounded-4 shadow-sm mb-4 hero-card" :dir="dir">
          <div>
            <span class="badge mb-2 text-dark hero-badge">{{ t('books.hero.badge') }}</span>
            <h1 class="fw-bold font-serif mb-2 hero-title">{{ t('books.hero.title') }}</h1>
            <p class="text-secondary mb-3 hero-text">{{ t('books.hero.text') }}</p>

            <div v-if="isAdmin && store.statistics" class="d-flex flex-wrap gap-3">
              <div class="bg-white px-3 py-2 rounded shadow-sm border stat-card">
                <span class="d-block text-muted small">{{ t('books.stats.total') }}</span>
                <strong class="fs-5 stat-value">{{ statValue('total_books', 'total') }}</strong>
              </div>
              <div class="bg-white px-3 py-2 rounded shadow-sm border stat-card">
                <span class="d-block text-muted small">{{ t('books.stats.available') }}</span>
                <strong class="fs-5 stat-value">{{ statValue('available_books', 'available') }}</strong>
              </div>
              <div class="bg-white px-3 py-2 rounded shadow-sm border stat-card">
                <span class="d-block text-muted small">{{ t('books.stats.borrowed') }}</span>
                <strong class="fs-5 stat-value">{{ statValue('borrowed_books', 'borrowed') }}</strong>
              </div>
            </div>
          </div>
          <BaseButton v-if="isAdmin" class="btn-add-book" variant="warning" @click="openCreateModal">
            <img :src="plusIcon" alt="" width="18" height="18" class="me-2" />{{ t('books.actions.add') }}
          </BaseButton>
        </div>

        <transition name="alert-fade">
          <div
            v-if="pageAlert.show"
            :class="['page-alert d-flex align-items-center gap-2 mb-4 px-3 py-2 rounded-3', `page-alert--${pageAlert.type}`]"
            role="alert"
            :dir="dir"
          >
            <img :src="pageAlert.type === 'success' ? checkCircleIcon : alertIcon" alt="" width="16" height="16" />
            <span class="small flex-fill">{{ pageAlert.message }}</span>
            <button type="button" class="btn-close btn-close-sm ms-auto" @click="pageAlert.show = false" aria-label="Close"></button>
          </div>
        </transition>

        <div class="d-flex flex-wrap align-items-center gap-3 mb-4" :dir="dir">
          <div class="search-wrap-outer flex-grow-1">
            <BaseInput
              v-model="searchQuery"
              :icon="searchIcon"
              :placeholder="t('books.search.placeholder')"
              @update:modelValue="onSearchInput"
            />
          </div>

          <div v-if="isAdmin" class="btn-group tab-toggle" role="group">
            <button type="button" class="btn" :class="showDeleted ? 'btn-tab' : 'btn-tab btn-tab--active'" @click="setShowDeleted(false)">
              {{ t('books.tabs.active') }}
            </button>
            <button type="button" class="btn" :class="showDeleted ? 'btn-tab btn-tab--active' : 'btn-tab'" @click="setShowDeleted(true)">
              {{ t('books.tabs.deleted') }}
            </button>
          </div>
        </div>

        <div v-if="store.loading" class="row g-4 mb-4">
          <div class="col-12 col-sm-6 col-lg-4" v-for="n in 6" :key="n">
            <div class="skeleton-card rounded-4"></div>
          </div>
        </div>

        <div v-else-if="store.error" class="text-center py-5 state-card rounded-4 shadow-sm" :dir="dir">
          <img :src="alertIcon" alt="" width="32" height="32" class="mb-3 opacity-75" />
          <p class="fw-semibold mb-1 state-title">{{ t('books.error.loadFailed') }}</p>
          <p class="text-muted small mb-3">{{ store.error }}</p>
          <BaseButton variant="outline-dark" size="sm" @click="loadBooks">{{ t('books.error.retry') }}</BaseButton>
        </div>

        <div v-else-if="!store.books.length" class="text-center py-5 state-card rounded-4 shadow-sm" :dir="dir">
          <img :src="bookIcon" alt="" width="36" height="36" class="mb-3 opacity-50 empty-icon" />
          <p class="fw-semibold mb-1 state-title">{{ emptyTitle }}</p>
          <p class="text-muted small mb-0">{{ emptyText }}</p>
        </div>

        <div v-else class="row g-4 mb-4">
          <div class="col-12 col-sm-6 col-lg-4" v-for="book in store.books" :key="book.id">
            <BookCard
              :book="book"
              :is-deleted-view="showDeleted"
              @view="openViewModal"
              @edit="openEditModal"
              @delete="openDeleteConfirm"
              @restore="openRestoreConfirm"
              @history="openHistoryModal"
            />
          </div>
        </div>

        <nav v-if="store.meta && store.meta.last_page > 1" class="d-flex justify-content-center mb-4" :dir="dir">
          <ul class="pagination pagination-custom mb-0">
            <li class="page-item" :class="{ disabled: store.meta.current_page <= 1 }">
              <button type="button" class="page-link" @click="goToPage(store.meta.current_page - 1)">{{ t('books.pagination.previous') }}</button>
            </li>
            <li class="page-item disabled d-flex align-items-center px-3">
              <span class="small text-muted">{{ t('books.pagination.pageInfo', { current: store.meta.current_page, total: store.meta.last_page }) }}</span>
            </li>
            <li class="page-item" :class="{ disabled: store.meta.current_page >= store.meta.last_page }">
              <button type="button" class="page-link" @click="goToPage(store.meta.current_page + 1)">{{ t('books.pagination.next') }}</button>
            </li>
          </ul>
        </nav>

        <Footer />
      </div>
    </div>

    <BookFormModal
      :show="formModal.show"
      :mode="formModal.mode"
      :book="formModal.book"
      @close="closeFormModal"
      @saved="handleSaved"
    />

    <BookHistoryModal
      :show="historyModal.show"
      :book-title="historyModal.book?.title || ''"
      :entries="store.historyEntries"
      :loading="store.historyLoading"
      @close="closeHistoryModal"
    />

    <ConfirmModal
      :show="confirmState.show"
      :title="confirmState.type === 'restore' ? t('books.restore.title') : t('books.delete.title')"
      :message="confirmMessage"
      :confirm-label="confirmState.type === 'restore' ? t('books.restore.confirm') : t('books.delete.confirm')"
      :cancel-label="t('books.actions.cancel')"
      :danger="confirmState.type !== 'restore'"
      :loading="confirmState.type === 'restore' ? store.restoring : store.deleting"
      @confirm="handleConfirm"
      @cancel="closeConfirm"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Header from '../../Dashboard/components/Header.vue'
import Sidebar from '../../Dashboard/components/Sidebar.vue'
import Footer from '../../Dashboard/components/Footer.vue'
import BaseInput from '@/core/components/BaseInput.vue'
import BaseButton from '@/core/components/BaseButton.vue'
import ConfirmModal from '@/core/components/ConfirmModal.vue'
import { useAuthStore } from '@/modules/Auth/store/authStore'
import BookCard from '../components/BookCard.vue'
import BookFormModal from '../components/BookFormModal.vue'
import BookHistoryModal from '../components/BookHistoryModal.vue'
import { useBooksStore } from '../store/booksStore'
import { debounce } from '@/core/utils/helpers'
import searchIcon      from '../../../assets/icons/search.svg'
import plusIcon        from '../../../assets/icons/user-plus.svg'
import bookIcon        from '../../../assets/icons/book.svg'
import alertIcon       from '../../../assets/icons/alert-circle.svg'
import checkCircleIcon from '../../../assets/icons/check-circle.svg'

const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)
const store = useBooksStore()

const searchQuery = ref('')
const showDeleted = ref(false)

const emptyTitle = computed(() => {
  if (showDeleted.value) return t('books.empty.titleDeleted')
  return searchQuery.value ? t('books.empty.titleFiltered') : t('books.empty.title')
})
const emptyText = computed(() => {
  if (showDeleted.value) return t('books.empty.textDeleted')
  return searchQuery.value ? t('books.empty.textFiltered') : t('books.empty.text')
})

function statValue(key, fallbackKey) {
  const stats = store.statistics || {}
  return stats[key] ?? stats[fallbackKey] ?? '—'
}

const pageAlert = reactive({ show: false, type: 'success', message: '' })
function showPageAlert(type, message) {
  pageAlert.show = true
  pageAlert.type = type
  pageAlert.message = message
}

function loadBooks(page = 1) {
  const params = { search: searchQuery.value || undefined, page }
  if (showDeleted.value) params.trashed = 'only'
  store.fetchBooks(params)
}

const onSearchInput = debounce(() => loadBooks(1), 350)

function setShowDeleted(val) {
  showDeleted.value = val
  loadBooks(1)
}

function goToPage(page) {
  if (page < 1 || (store.meta && page > store.meta.last_page)) return
  loadBooks(page)
}

const formModal = reactive({ show: false, mode: 'create', book: null })

function openCreateModal() {
  formModal.mode = 'create'
  formModal.book = null
  formModal.show = true
}

function openEditModal(book) {
  formModal.mode = 'edit'
  formModal.book = book
  formModal.show = true
}

function openViewModal(book) {
  formModal.mode = 'view'
  formModal.book = book
  formModal.show = true
}

function closeFormModal() {
  formModal.show = false
}

function handleSaved({ mode }) {
  showPageAlert('success', mode === 'create' ? t('books.form.messages.createSuccess') : t('books.form.messages.updateSuccess'))
}

const historyModal = reactive({ show: false, book: null })

function openHistoryModal(book) {
  historyModal.book = book
  historyModal.show = true
  store.fetchHistory(book.id)
}

function closeHistoryModal() {
  historyModal.show = false
  historyModal.book = null
}

const confirmState = reactive({ show: false, type: 'delete', book: null })

const confirmMessage = computed(() => {
  const title = confirmState.book?.title || ''
  return confirmState.type === 'restore'
    ? t('books.restore.message', { title })
    : t('books.delete.message', { title })
})

function openDeleteConfirm(book) {
  confirmState.type = 'delete'
  confirmState.book = book
  confirmState.show = true
}

function openRestoreConfirm(book) {
  confirmState.type = 'restore'
  confirmState.book = book
  confirmState.show = true
}

function closeConfirm() {
  confirmState.show = false
  confirmState.book = null
}

async function handleConfirm() {
  try {
    if (confirmState.type === 'restore') {
      await store.restoreBook(confirmState.book.id)
      showPageAlert('success', t('books.restore.success'))
    } else {
      await store.deleteBook(confirmState.book.id)
      showPageAlert('success', t('books.delete.success'))
    }
    closeConfirm()
  } catch {
    showPageAlert('error', confirmState.type === 'restore' ? t('books.restore.failed') : t('books.delete.failed'))
    closeConfirm()
  }
}

onMounted(() => {
  loadBooks(1)
  if (isAdmin.value) store.fetchStatistics()
})
</script>

<style scoped>
.books-layout {
  background-color: var(--bg-page);
  min-height: 100vh;
  overflow-x: hidden;
}

.books-body {
  min-height: calc(100vh - 68px);
  min-width: 0;
}

.books-body > .flex-grow-1 {
  min-width: 0;
}

.hero-card {
  background-color: var(--gold-tint);
  border: 1px solid var(--border);
}

.hero-badge {
  background-color: var(--gold);
}

.hero-title {
  font-family: Georgia, serif;
  color: var(--navy);
  font-size: 1.75rem;
}

.hero-text {
  line-height: 1.8;
  max-width: 560px;
}

.stat-card {
  border-color: var(--border) !important;
}

.stat-value {
  color: var(--navy);
}

.btn-add-book {
  background: var(--mustard);
  color: var(--navy);
  border: none;
  font-weight: 600;
  white-space: nowrap;
}

.btn-add-book:hover:not(:disabled) {
  background: var(--gold);
}

.search-wrap-outer {
  max-width: 420px;
}

.tab-toggle {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  overflow: hidden;
}

.btn-tab {
  background: #fff;
  color: var(--text-muted);
  border: none;
  border-radius: 0;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
}

.btn-tab--active {
  background: var(--navy);
  color: #fff;
}

.page-alert {
  font-size: 0.85rem;
  border: 1px solid transparent;
}

.page-alert--success { background: rgba(25, 135, 84, 0.08); border-color: rgba(25, 135, 84, 0.28); color: #0a5c35; }
.page-alert--error   { background: rgba(128, 0, 32, 0.07);  border-color: rgba(128, 0, 32, 0.28);  color: var(--burgundy); }

.skeleton-card {
  height: 150px;
  background: linear-gradient(90deg, var(--bg-card) 25%, var(--gold-tint) 37%, var(--bg-card) 63%);
  background-size: 400% 100%;
  animation: skeleton-shimmer 1.4s ease infinite;
  border: 1px solid var(--border);
}

@keyframes skeleton-shimmer {
  0%   { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

.state-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
}

.state-title {
  color: var(--navy);
}

.empty-icon {
  filter: invert(14%) sepia(23%) saturate(1200%) hue-rotate(165deg);
}

.pagination-custom .page-link {
  color: var(--navy);
  border-color: var(--border);
}

.pagination-custom .page-item.disabled .page-link {
  color: var(--text-muted);
  background-color: transparent;
  border-color: var(--border);
}

.pagination-custom .page-link:hover {
  background-color: var(--gold-tint);
  color: var(--navy);
}

.alert-fade-enter-active { transition: opacity 0.3s, transform 0.3s; }
.alert-fade-leave-active { transition: opacity 0.2s, transform 0.2s; }
.alert-fade-enter-from   { opacity: 0; transform: translateY(-8px); }
.alert-fade-leave-to     { opacity: 0; transform: translateY(-8px); }

@media (max-width: 991.98px) {
  .hero-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 575.98px) {
  .hero-title {
    font-size: 1.3rem;
  }
}
</style>
