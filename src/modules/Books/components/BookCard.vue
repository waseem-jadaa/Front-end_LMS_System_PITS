<template>
  <div class="card h-100 border-0 shadow-sm rounded-4 p-3 book-card" :class="{ 'book-card--deleted': isDeletedView }">
    <div class="d-flex gap-3">
      <div class="rounded p-3 text-white d-flex align-items-center justify-content-center book-cover-placeholder flex-shrink-0">
        <span class="small text-center">{{ t('books.card.placeholder') }}</span>
      </div>
      <div class="book-info flex-grow-1">
        <div class="d-flex align-items-start justify-content-between gap-2">
          <span class="badge bg-light text-dark border mb-1 book-category">{{ book.category }}</span>
          <span v-if="isDeletedView" class="badge deleted-badge mb-1">{{ t('books.card.deleted') }}</span>
          <span v-else class="badge mb-1" :class="isAvailable ? 'available-badge' : 'unavailable-badge'">
            {{ isAvailable ? t('books.card.available') : t('books.card.unavailable') }}
          </span>
        </div>
        <h6 class="fw-bold mb-1 book-title text-truncate">{{ book.title }}</h6>
        <p class="text-muted small mb-0 text-truncate">{{ book.author }} • {{ book.publish_year }}</p>
      </div>
    </div>

    <div class="d-flex justify-content-end gap-2 mt-3 pt-2 book-actions">
      <button type="button" class="btn p-2 rounded-circle border-0 row-icon-btn" :title="t('books.actions.view')" @click="$emit('view', book)">
        <img :src="eyeIcon" alt="" width="16" height="16" />
      </button>

      <template v-if="isAdmin">
        <button type="button" class="btn p-2 rounded-circle border-0 row-icon-btn" :title="t('books.actions.history')" @click="$emit('history', book)">
          <img :src="historyIcon" alt="" width="16" height="16" />
        </button>

        <template v-if="isDeletedView">
          <button type="button" class="btn p-2 rounded-circle border-0 row-icon-btn row-icon-btn--success" :title="t('books.actions.restore')" @click="$emit('restore', book)">
            <img :src="restoreIcon" alt="" width="16" height="16" />
          </button>
        </template>
        <template v-else>
          <button type="button" class="btn p-2 rounded-circle border-0 row-icon-btn" :title="t('books.actions.edit')" @click="$emit('edit', book)">
            <img :src="editIcon" alt="" width="16" height="16" />
          </button>
          <button type="button" class="btn p-2 rounded-circle border-0 row-icon-btn row-icon-btn--danger" :title="t('books.actions.delete')" @click="$emit('delete', book)">
            <img :src="trashIcon" alt="" width="16" height="16" />
          </button>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/modules/Auth/store/authStore'
import eyeIcon      from '../../../assets/icons/eye.svg'
import editIcon     from '../../../assets/icons/edit-2.svg'
import trashIcon    from '../../../assets/icons/trash-2.svg'
import historyIcon  from '../../../assets/icons/file-text.svg'
import restoreIcon  from '../../../assets/icons/login.svg'

const { t } = useI18n()
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)

const props = defineProps({
  book:          { type: Object, required: true },
  isDeletedView: { type: Boolean, default: false }
})

defineEmits(['view', 'edit', 'delete', 'restore', 'history'])

const isAvailable = computed(() => !!Number(props.book.is_available))
</script>

<style scoped>
.book-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border) !important;
}

.book-card--deleted {
  opacity: 0.7;
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

.deleted-badge {
  font-size: 10px;
  background-color: rgba(128, 0, 32, 0.1);
  color: var(--burgundy);
}

.available-badge {
  font-size: 10px;
  background-color: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.unavailable-badge {
  font-size: 10px;
  background-color: var(--gold-tint);
  color: var(--wood);
}

.book-title {
  color: var(--navy);
}

.book-actions {
  border-top: 1px solid var(--border);
}

.row-icon-btn {
  width: 32px;
  height: 32px;
  background-color: var(--gold-tint);
  color: var(--navy);
  transition: all 0.2s ease;
}

.row-icon-btn:hover {
  background-color: var(--border);
  transform: scale(1.05);
}

.row-icon-btn--danger:hover {
  background-color: rgba(128, 0, 32, 0.1);
}

.row-icon-btn--danger img {
  filter: invert(10%) sepia(80%) saturate(3000%) hue-rotate(320deg);
}

.row-icon-btn--success img {
  filter: invert(30%) sepia(90%) saturate(600%) hue-rotate(90deg);
}
</style>
