<template>
  <nav v-if="lastPage > 1" class="d-flex justify-content-center">
    <ul class="pagination pagination-custom mb-0">
      <li class="page-item" :class="{ disabled: currentPage <= 1 }">
        <button
          type="button"
          class="page-link page-link--icon"
          :aria-label="t('common.pagination.previous')"
          @click="goTo(currentPage - 1)"
        >
          <img :src="chevronLeftIcon" alt="" width="16" height="16" />
        </button>
      </li>
      <li class="page-item disabled d-flex align-items-center px-3">
        <span class="small text-muted">{{ t('common.pagination.pageInfo', { current: currentPage, total: lastPage }) }}</span>
      </li>
      <li class="page-item" :class="{ disabled: currentPage >= lastPage }">
        <button
          type="button"
          class="page-link page-link--icon"
          :aria-label="t('common.pagination.next')"
          @click="goTo(currentPage + 1)"
        >
          <img :src="chevronLeftIcon" alt="" width="16" height="16" class="page-link__icon--next" />
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import chevronLeftIcon from '../../assets/icons/chevron-left.svg'

const { t } = useI18n()

const props = defineProps({
  currentPage: { type: Number, required: true },
  lastPage: { type: Number, required: true }
})

const emit = defineEmits(['update:page'])

function goTo(page) {
  if (page < 1 || page > props.lastPage) return
  emit('update:page', page)
}
</script>

<style scoped>
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

.page-link--icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-link--icon img {
  filter: invert(14%) sepia(23%) saturate(1200%) hue-rotate(165deg);
  opacity: 0.85;
}

.page-item.disabled .page-link--icon img {
  opacity: 0.35;
}

.page-link__icon--next {
  transform: scaleX(-1);
}

[dir="rtl"] .page-link--icon img:not(.page-link__icon--next) {
  transform: scaleX(-1);
}

[dir="rtl"] .page-link__icon--next {
  transform: scaleX(1);
}
</style>
