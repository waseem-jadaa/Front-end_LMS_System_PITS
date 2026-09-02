<template>
  <div class="container-fluid p-0 borrowings-layout" :dir="dir">
    <Header />

    <div class="d-flex borrowings-body">
      <Sidebar />

      <div class="flex-grow-1 p-3 p-md-4" dir="ltr">

        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3 p-md-4 rounded-4 shadow-sm mb-4 hero-card" :dir="dir">
          <div>
            <span class="badge mb-2 text-dark hero-badge">{{ t('borrowings.hero.badge') }}</span>
            <h1 class="fw-bold font-serif mb-2 hero-title">{{ isAdmin ? t('borrowings.hero.titleAdmin') : t('borrowings.hero.titleMember') }}</h1>
            <p class="text-secondary mb-0 hero-text">{{ isAdmin ? t('borrowings.hero.textAdmin') : t('borrowings.hero.textMember') }}</p>
          </div>
          <BaseButton v-if="isAdmin" class="btn-add-member" variant="warning" @click="openAddMemberModal">
            <img :src="plusIcon" alt="" width="18" height="18" class="me-2" />{{ t('borrowings.actions.addMember') }}
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

        <div class="d-flex flex-wrap gap-2 mb-4" :dir="dir">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="btn btn-tab"
            :class="{ 'btn-tab--active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>

        <div v-if="store.loading" class="row g-3 mb-4" :dir="dir">
          <div class="col-12" v-for="n in 4" :key="n">
            <div class="skeleton-row rounded-4"></div>
          </div>
        </div>

        <div v-else-if="store.error" class="text-center py-5 state-card rounded-4 shadow-sm" :dir="dir">
          <img :src="alertIcon" alt="" width="32" height="32" class="mb-3 opacity-75" />
          <p class="fw-semibold mb-1 state-title">{{ t('borrowings.error.loadFailed') }}</p>
          <p class="text-muted small mb-3">{{ store.error }}</p>
          <BaseButton variant="outline-dark" size="sm" @click="loadBorrowings">{{ t('borrowings.error.retry') }}</BaseButton>
        </div>

        <div v-else-if="!filteredBorrowings.length" class="text-center py-5 state-card rounded-4 shadow-sm" :dir="dir">
          <img :src="bookIcon" alt="" width="36" height="36" class="mb-3 opacity-50 empty-icon" />
          <p class="fw-semibold mb-1 state-title">{{ t('borrowings.empty.title') }}</p>
          <p class="text-muted small mb-0">{{ isAdmin ? t('borrowings.empty.textAdmin') : t('borrowings.empty.textMember') }}</p>
        </div>

        <template v-else>
          <div class="d-md-none row g-3 mb-4" :dir="dir">
            <div class="col-12" v-for="borrowing in filteredBorrowings" :key="borrowing.id">
              <BorrowingCard
                :borrowing="borrowing"
                :is-admin="isAdmin"
                @edit="openEditModal"
                @delete="openDeleteConfirm"
                @return="openReturnConfirm"
                @borrow-again="handleBorrowAgain"
              />
            </div>
          </div>

          <BaseCard flat class="borrowings-table-card mb-4 d-none d-md-block">
            <div class="table-responsive">
              <table class="table align-middle mb-0 borrowings-table" :dir="dir">
                <thead>
                  <tr>
                    <th>{{ t('borrowings.table.book') }}</th>
                    <th v-if="isAdmin">{{ t('borrowings.table.member') }}</th>
                    <th class="d-none d-lg-table-cell">{{ t('borrowings.table.borrowed') }}</th>
                    <th>{{ t('borrowings.table.due') }}</th>
                    <th>{{ t('borrowings.table.status') }}</th>
                    <th class="text-end">{{ t('borrowings.table.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <BorrowingRow
                    v-for="borrowing in filteredBorrowings"
                    :key="borrowing.id"
                    :borrowing="borrowing"
                    :is-admin="isAdmin"
                    @edit="openEditModal"
                    @delete="openDeleteConfirm"
                    @return="openReturnConfirm"
                    @borrow-again="handleBorrowAgain"
                  />
                </tbody>
              </table>
            </div>
          </BaseCard>
        </template>

        <nav v-if="store.meta && store.meta.last_page > 1" class="d-flex justify-content-center mb-4" :dir="dir">
          <ul class="pagination pagination-custom mb-0">
            <li class="page-item" :class="{ disabled: store.meta.current_page <= 1 }">
              <button type="button" class="page-link" @click="goToPage(store.meta.current_page - 1)">{{ t('borrowings.pagination.previous') }}</button>
            </li>
            <li class="page-item disabled d-flex align-items-center px-3">
              <span class="small text-muted">{{ t('borrowings.pagination.pageInfo', { current: store.meta.current_page, total: store.meta.last_page }) }}</span>
            </li>
            <li class="page-item" :class="{ disabled: store.meta.current_page >= store.meta.last_page }">
              <button type="button" class="page-link" @click="goToPage(store.meta.current_page + 1)">{{ t('borrowings.pagination.next') }}</button>
            </li>
          </ul>
        </nav>

        <Footer />
      </div>
    </div>

    <BorrowingEditModal
      :show="editModal.show"
      :borrowing="editModal.borrowing"
      @close="closeEditModal"
      @saved="handleEditSaved"
    />

    <MemberFormModal
      :show="addMemberModal.show"
      mode="create"
      @close="closeAddMemberModal"
      @saved="handleMemberSaved"
    />

    <ConfirmModal
      :show="confirmState.show"
      :title="confirmState.type === 'return' ? t('borrowings.return.title') : t('borrowings.delete.title')"
      :message="confirmMessage"
      :confirm-label="confirmState.type === 'return' ? t('borrowings.return.confirm') : t('borrowings.delete.confirm')"
      :cancel-label="t('borrowings.actions.cancel')"
      :danger="confirmState.type !== 'return'"
      :loading="confirmState.type === 'return' ? store.returning : store.deleting"
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
import BaseCard from '@/core/components/BaseCard.vue'
import BaseButton from '@/core/components/BaseButton.vue'
import ConfirmModal from '@/core/components/ConfirmModal.vue'
import { useAuthStore } from '@/modules/Auth/store/authStore'
import BorrowingRow from '../components/BorrowingRow.vue'
import BorrowingCard from '../components/BorrowingCard.vue'
import BorrowingEditModal from '../components/BorrowingEditModal.vue'
import MemberFormModal from '@/modules/Members/components/MemberFormModal.vue'
import { useBorrowingsStore } from '../store/borrowingsStore'
import { getBookTitle, getStatus } from '../utils/borrowingHelpers'
import bookIcon        from '../../../assets/icons/book.svg'
import plusIcon        from '../../../assets/icons/user-plus.svg'
import alertIcon       from '../../../assets/icons/alert-circle.svg'
import checkCircleIcon from '../../../assets/icons/check-circle.svg'

const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)
const store = useBorrowingsStore()

const activeTab = ref('all')
const tabs = computed(() => [
  { key: 'all',      label: t('borrowings.tabs.all') },
  { key: 'active',   label: t('borrowings.tabs.active') },
  { key: 'overdue',  label: t('borrowings.tabs.overdue') },
  { key: 'returned', label: t('borrowings.tabs.returned') }
])

const filteredBorrowings = computed(() => {
  if (activeTab.value === 'all') return store.borrowings
  return store.borrowings.filter(b => getStatus(b) === activeTab.value)
})

const pageAlert = reactive({ show: false, type: 'success', message: '' })
function showPageAlert(type, message) {
  pageAlert.show = true
  pageAlert.type = type
  pageAlert.message = message
}

function loadBorrowings(page = 1) {
  store.fetchBorrowings({ page })
}

function goToPage(page) {
  if (page < 1 || (store.meta && page > store.meta.last_page)) return
  loadBorrowings(page)
}

const editModal = reactive({ show: false, borrowing: null })
function openEditModal(borrowing) {
  editModal.borrowing = borrowing
  editModal.show = true
}
function closeEditModal() {
  editModal.show = false
}
function handleEditSaved() {
  showPageAlert('success', t('borrowings.form.messages.updateSuccess'))
}

const addMemberModal = reactive({ show: false })
function openAddMemberModal() {
  addMemberModal.show = true
}
function closeAddMemberModal() {
  addMemberModal.show = false
}
function handleMemberSaved() {
  showPageAlert('success', t('members.form.messages.createSuccess'))
}

const confirmState = reactive({ show: false, type: 'delete', borrowing: null })
const confirmMessage = computed(() => {
  const title = confirmState.borrowing ? getBookTitle(confirmState.borrowing) : ''
  return confirmState.type === 'return'
    ? t('borrowings.return.message', { title })
    : t('borrowings.delete.message', { title })
})

function openDeleteConfirm(borrowing) {
  confirmState.type = 'delete'
  confirmState.borrowing = borrowing
  confirmState.show = true
}
function openReturnConfirm(borrowing) {
  confirmState.type = 'return'
  confirmState.borrowing = borrowing
  confirmState.show = true
}
function closeConfirm() {
  confirmState.show = false
  confirmState.borrowing = null
}

async function handleConfirm() {
  try {
    if (confirmState.type === 'return') {
      await store.returnBorrowing(confirmState.borrowing.id)
      showPageAlert('success', t('borrowings.return.success'))
    } else {
      await store.deleteBorrowing(confirmState.borrowing.id)
      showPageAlert('success', t('borrowings.delete.success'))
    }
    closeConfirm()
  } catch {
    showPageAlert('error', confirmState.type === 'return' ? t('borrowings.return.failed') : t('borrowings.delete.failed'))
    closeConfirm()
  }
}

async function handleBorrowAgain(borrowing) {
  try {
    await store.createBorrowing({ book_id: borrowing.book_id ?? borrowing.book?.id })
    showPageAlert('success', t('borrowings.borrowAgain.success'))
    loadBorrowings()
  } catch {
    showPageAlert('error', t('borrowings.borrowAgain.failed'))
  }
}

onMounted(() => loadBorrowings(1))
</script>

<style scoped>
.borrowings-layout {
  background-color: var(--bg-page);
  min-height: 100vh;
  overflow-x: hidden;
}

.borrowings-body {
  min-height: calc(100vh - 68px);
  min-width: 0;
}

.borrowings-body > .flex-grow-1 {
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
  max-width: 640px;
}

.btn-add-member {
  background: var(--mustard);
  color: var(--navy);
  border: none;
  font-weight: 600;
  white-space: nowrap;
}

.btn-add-member:hover:not(:disabled) {
  background: var(--gold);
}

.btn-tab {
  background: #fff;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.4rem 1rem;
}

.btn-tab--active {
  background: var(--navy);
  color: #fff;
  border-color: var(--navy);
}

.page-alert {
  font-size: 0.85rem;
  border: 1px solid transparent;
}

.page-alert--success { background: rgba(25, 135, 84, 0.08); border-color: rgba(25, 135, 84, 0.28); color: #0a5c35; }
.page-alert--error   { background: rgba(128, 0, 32, 0.07);  border-color: rgba(128, 0, 32, 0.28);  color: var(--burgundy); }

.skeleton-row {
  height: 64px;
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

.borrowings-table-card {
  border: 1px solid var(--border) !important;
}

.borrowings-table thead th {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  border-bottom-color: var(--border) !important;
  padding: 0.9rem 1.25rem;
  background-color: var(--bg-page);
}

.borrowings-table tbody td {
  padding: 0.85rem 1.25rem;
  border-bottom-color: var(--border) !important;
}

.borrowings-table tbody tr:last-child td {
  border-bottom: none;
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
