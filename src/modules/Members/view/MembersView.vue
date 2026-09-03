<template>
  <div class="container-fluid p-0 members-layout" :dir="dir">
    <Header />

    <div class="d-flex members-body">
      <Sidebar />

      <div class="flex-grow-1 p-3 p-md-4" dir="ltr">

        <div class="p-3 p-md-4 rounded-4 shadow-sm mb-4 hero-card" :dir="dir">
          <span class="badge mb-2 text-dark hero-badge">{{ t('members.hero.badge') }}</span>
          <h1 class="fw-bold font-serif mb-2 hero-title">{{ t('members.hero.title') }}</h1>
          <p class="text-secondary mb-0 hero-text">{{ t('members.hero.text') }}</p>
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

        <div class="mb-4 search-wrap-outer" :dir="dir">
          <BaseInput
            v-model="searchQuery"
            :icon="searchIcon"
            :placeholder="t('members.search.placeholder')"
            @update:modelValue="onSearchInput"
          />
        </div>

        <div v-if="store.meta" class="d-flex justify-content-end mb-3" :dir="dir">
          <PageSizeSelect v-model="perPage" @update:modelValue="onPerPageChange" />
        </div>

        <div v-if="store.loading" class="row g-3 mb-4" :dir="dir">
          <div class="col-12" v-for="n in 4" :key="n">
            <div class="skeleton-row rounded-4"></div>
          </div>
        </div>

        <div v-else-if="store.error" class="text-center py-5 state-card rounded-4 shadow-sm" :dir="dir">
          <img :src="alertIcon" alt="" width="32" height="32" class="mb-3 opacity-75" />
          <p class="fw-semibold mb-1 state-title">{{ t('members.error.loadFailed') }}</p>
          <p class="text-muted small mb-3">{{ store.error }}</p>
          <BaseButton variant="outline-dark" size="sm" @click="loadMembers">{{ t('members.error.retry') }}</BaseButton>
        </div>

        <div v-else-if="!store.members.length" class="text-center py-5 state-card rounded-4 shadow-sm" :dir="dir">
          <img :src="usersIcon" alt="" width="36" height="36" class="mb-3 opacity-50 empty-icon" />
          <p class="fw-semibold mb-1 state-title">{{ searchQuery ? t('members.empty.titleFiltered') : t('members.empty.title') }}</p>
          <p class="text-muted small mb-0">{{ searchQuery ? t('members.empty.textFiltered') : t('members.empty.text') }}</p>
        </div>

        <template v-else>
          <div class="d-md-none row g-3 mb-4" :dir="dir">
            <div class="col-12" v-for="member in store.members" :key="member.id">
              <MemberCard
                :member="member"
                @view="openViewModal"
                @edit="openEditModal"
                @delete="openDeleteConfirm"
              />
            </div>
          </div>

          <BaseCard flat class="members-table-card mb-4 d-none d-md-block">
            <div class="table-responsive">
              <table class="table align-middle mb-0 members-table" :dir="dir">
                <thead>
                  <tr>
                    <th>{{ t('members.table.member') }}</th>
                    <th>{{ t('members.table.email') }}</th>
                    <th class="text-end">{{ t('members.table.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <MemberRow
                    v-for="member in store.members"
                    :key="member.id"
                    :member="member"
                    @view="openViewModal"
                    @edit="openEditModal"
                    @delete="openDeleteConfirm"
                  />
                </tbody>
              </table>
            </div>
          </BaseCard>
        </template>

        <Pagination
          v-if="store.meta"
          class="mb-4"
          :current-page="store.meta.current_page"
          :last-page="store.meta.last_page"
          @update:page="goToPage"
        />

        <Footer />
      </div>
    </div>

    <MemberFormModal
      :show="formModal.show"
      :mode="formModal.mode"
      :member="formModal.member"
      @close="closeFormModal"
      @saved="handleSaved"
    />

    <ConfirmModal
      :show="deleteConfirm.show"
      :title="t('members.delete.title')"
      :message="t('members.delete.message', { name: deleteConfirm.member?.name || '' })"
      :confirm-label="t('members.delete.confirm')"
      :cancel-label="t('members.actions.cancel')"
      :loading="store.deleting"
      @confirm="confirmDelete"
      @cancel="closeDeleteConfirm"
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
import BaseInput from '@/core/components/BaseInput.vue'
import BaseButton from '@/core/components/BaseButton.vue'
import MemberRow from '../components/MemberRow.vue'
import MemberCard from '../components/MemberCard.vue'
import MemberFormModal from '../components/MemberFormModal.vue'
import ConfirmModal from '@/core/components/ConfirmModal.vue'
import Pagination from '@/core/components/Pagination.vue'
import PageSizeSelect from '@/core/components/PageSizeSelect.vue'
import { useMembersStore } from '../store/membersStore'
import { debounce } from '@/core/utils/helpers'
import searchIcon      from '../../../assets/icons/search.svg'
import usersIcon       from '../../../assets/icons/users.svg'
import alertIcon       from '../../../assets/icons/alert-circle.svg'
import checkCircleIcon from '../../../assets/icons/check-circle.svg'

const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
const store = useMembersStore()

const searchQuery = ref('')
const perPage = ref(10)

const pageAlert = reactive({ show: false, type: 'success', message: '' })
function showPageAlert(type, message) {
  pageAlert.show = true
  pageAlert.type = type
  pageAlert.message = message
}

function loadMembers(page = 1) {
  store.fetchMembers({ search: searchQuery.value || undefined, page, per_page: perPage.value })
}

const onSearchInput = debounce(() => loadMembers(1), 1200)

function goToPage(page) {
  if (page < 1 || (store.meta && page > store.meta.last_page)) return
  loadMembers(page)
}

function onPerPageChange(val) {
  perPage.value = val
  loadMembers(1)
}

const formModal = reactive({ show: false, mode: 'view', member: null })

function openEditModal(member) {
  formModal.mode = 'edit'
  formModal.member = member
  formModal.show = true
}

function openViewModal(member) {
  formModal.mode = 'view'
  formModal.member = member
  formModal.show = true
}

function closeFormModal() {
  formModal.show = false
}

function handleSaved() {
  showPageAlert('success', t('members.form.messages.updateSuccess'))
}

const deleteConfirm = reactive({ show: false, member: null })

function openDeleteConfirm(member) {
  deleteConfirm.member = member
  deleteConfirm.show = true
}

function closeDeleteConfirm() {
  deleteConfirm.show = false
  deleteConfirm.member = null
}

async function confirmDelete() {
  try {
    await store.deleteMember(deleteConfirm.member.id)
    showPageAlert('success', t('members.delete.success'))
    closeDeleteConfirm()
  } catch {
    showPageAlert('error', t('members.delete.failed'))
    closeDeleteConfirm()
  }
}

onMounted(() => loadMembers(1))
</script>

<style scoped>
.members-layout {
  background-color: var(--bg-page);
  min-height: 100vh;
  overflow-x: hidden;
}

.members-body {
  min-height: calc(100vh - 68px);
  min-width: 0;
}

.members-body > .flex-grow-1 {
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

.search-wrap-outer {
  max-width: 420px;
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

.members-table-card {
  border: 1px solid var(--border) !important;
}

.members-table thead th {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  border-bottom-color: var(--border) !important;
  padding: 0.9rem 1.25rem;
  background-color: var(--bg-page);
}

.members-table tbody td {
  padding: 0.85rem 1.25rem;
  border-bottom-color: var(--border) !important;
}

.members-table tbody tr:last-child td {
  border-bottom: none;
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
