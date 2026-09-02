<template>
  <div class="card border-0 shadow-sm rounded-4 p-3 member-card">
    <div class="d-flex align-items-center gap-3">
      <div class="member-avatar rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0">
        {{ initials }}
      </div>
      <div class="min-w-0 flex-grow-1">
        <div class="fw-bold text-truncate member-name">{{ member.name }}</div>
        <div class="small text-muted text-truncate">{{ member.email }}</div>
      </div>
    </div>

    <div class="d-flex justify-content-end gap-2 mt-3 pt-2 member-actions">
      <button type="button" class="btn rounded-circle border-0 row-icon-btn" :title="t('members.actions.view')" @click="$emit('view', member)">
        <img :src="eyeIcon" alt="" width="16" height="16" />
      </button>
      <button type="button" class="btn rounded-circle border-0 row-icon-btn" :title="t('members.actions.edit')" @click="$emit('edit', member)">
        <img :src="editIcon" alt="" width="16" height="16" />
      </button>
      <button type="button" class="btn rounded-circle border-0 row-icon-btn row-icon-btn--danger" :title="t('members.actions.delete')" @click="$emit('delete', member)">
        <img :src="trashIcon" alt="" width="16" height="16" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getInitials } from '@/core/utils/helpers'
import eyeIcon   from '../../../assets/icons/eye.svg'
import editIcon  from '../../../assets/icons/edit-2.svg'
import trashIcon from '../../../assets/icons/trash-2.svg'

const { t } = useI18n()

const props = defineProps({
  member: { type: Object, required: true }
})

defineEmits(['view', 'edit', 'delete'])

const initials = computed(() => getInitials(props.member.name))
</script>

<style scoped>
.member-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border) !important;
}

.member-avatar {
  width: 44px;
  height: 44px;
  background-color: var(--navy);
  color: var(--gold);
  border: 1.5px solid var(--gold);
  font-size: 0.95rem;
}

.member-name {
  color: var(--navy);
}

.member-actions {
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
</style>
