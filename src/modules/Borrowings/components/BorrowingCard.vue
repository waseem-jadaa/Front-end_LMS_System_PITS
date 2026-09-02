<template>
  <div class="card border-0 shadow-sm rounded-4 p-3 borrowing-card">
    <div class="d-flex align-items-start justify-content-between gap-2">
      <div class="min-w-0">
        <div class="fw-bold text-truncate borrowing-book">{{ getBookTitle(borrowing) }}</div>
        <div v-if="getBookAuthor(borrowing)" class="small text-muted text-truncate">{{ getBookAuthor(borrowing) }}</div>
      </div>
      <span class="badge status-badge flex-shrink-0" :class="`status-badge--${status}`">{{ t(`borrowings.status.${status}`) }}</span>
    </div>

    <div v-if="isAdmin" class="small text-muted mt-2">{{ getMemberName(borrowing) }}</div>

    <div class="d-flex gap-4 small borrowing-dates mt-2">
      <div>
        <span class="d-block date-label">{{ t('borrowings.table.borrowed') }}</span>
        <span class="fw-semibold date-value">{{ formatDate(getBorrowedDate(borrowing)) }}</span>
      </div>
      <div>
        <span class="d-block date-label">{{ t('borrowings.table.due') }}</span>
        <span class="fw-semibold date-value">{{ formatDate(getDueDate(borrowing)) }}</span>
      </div>
    </div>

    <div class="d-flex justify-content-end gap-2 mt-3 pt-2 borrowing-actions">
      <template v-if="isAdmin">
        <button type="button" class="btn rounded-circle border-0 row-icon-btn" :title="t('borrowings.actions.edit')" @click="$emit('edit', borrowing)">
          <img :src="editIcon" alt="" width="16" height="16" />
        </button>
        <button type="button" class="btn rounded-circle border-0 row-icon-btn row-icon-btn--danger" :title="t('borrowings.actions.delete')" @click="$emit('delete', borrowing)">
          <img :src="trashIcon" alt="" width="16" height="16" />
        </button>
      </template>
      <template v-else>
        <button v-if="!isReturned(borrowing)" type="button" class="btn rounded-circle border-0 row-icon-btn row-icon-btn--success" :title="t('borrowings.actions.return')" @click="$emit('return', borrowing)">
          <img :src="checkIcon" alt="" width="16" height="16" />
        </button>
        <button v-else type="button" class="btn rounded-circle border-0 row-icon-btn" :title="t('borrowings.actions.borrowAgain')" @click="$emit('borrow-again', borrowing)">
          <img :src="bookIcon" alt="" width="16" height="16" />
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getBookTitle, getBookAuthor, getMemberName, getBorrowedDate, getDueDate, isReturned, getStatus } from '../utils/borrowingHelpers'
import editIcon  from '../../../assets/icons/edit-2.svg'
import trashIcon from '../../../assets/icons/trash-2.svg'
import checkIcon from '../../../assets/icons/check-circle.svg'
import bookIcon  from '../../../assets/icons/book-open.svg'

const { t, locale } = useI18n()

const props = defineProps({
  borrowing: { type: Object, required: true },
  isAdmin:   { type: Boolean, default: false }
})

defineEmits(['edit', 'delete', 'return', 'borrow-again'])

const status = computed(() => getStatus(props.borrowing))

function formatDate(raw) {
  if (!raw) return '—'
  try {
    return new Intl.DateTimeFormat(locale.value === 'ar' ? 'ar' : 'en-GB', { dateStyle: 'medium' }).format(new Date(raw))
  } catch {
    return raw
  }
}
</script>

<style scoped>
.borrowing-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border) !important;
}

.borrowing-book {
  color: var(--navy);
}

.status-badge {
  font-size: 10px;
  font-weight: 600;
}

.status-badge--active {
  background-color: var(--gold-tint);
  color: var(--wood);
}

.status-badge--overdue {
  background-color: rgba(128, 0, 32, 0.1);
  color: var(--burgundy);
}

.status-badge--returned {
  background-color: rgba(96, 122, 102, 0.15);
  color: var(--sage);
}

.date-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.date-value {
  color: var(--text-body);
}

.borrowing-actions {
  border-top: 1px solid var(--border);
}

.row-icon-btn {
  width: 34px;
  height: 34px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
