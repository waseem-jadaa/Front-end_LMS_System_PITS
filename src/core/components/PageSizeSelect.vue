<template>
  <div class="page-size">
    <label class="page-size__label" :for="selectId">{{ t('common.pagination.itemsPerPage') }}</label>
    <div class="page-size__control">
      <select
        :id="selectId"
        class="page-size__input"
        :value="modelValue"
        @change="$emit('update:modelValue', Number($event.target.value))"
      >
        <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
      </select>
      <svg class="page-size__chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
        <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  modelValue: { type: Number, required: true },
  options: { type: Array, default: () => [5, 10, 15, 20, 50, 100] }
})

defineEmits(['update:modelValue'])

const selectId = `page-size-${Math.random().toString(36).slice(2)}`
</script>

<style scoped>
.page-size {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-size__label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  margin: 0;
  white-space: nowrap;
}

.page-size__control {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.page-size__input {
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  background: #FDFBF7;
  border: 1.5px solid #D8CFC6;
  border-radius: 999px;
  color: var(--navy);
  font-size: 0.85rem;
  font-weight: 600;
  height: 38px;
  padding: 0 2rem 0 1rem;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.page-size__input:hover {
  border-color: var(--mustard, #D8AE49);
  background: #fff;
}

.page-size__input:focus {
  outline: none;
  background: #fff;
  border-color: #1A2E40;
  box-shadow: 0 0 0 3px rgba(26, 46, 64, 0.15);
}

.page-size__chevron {
  position: absolute;
  right: 0.9rem;
  color: var(--navy);
  opacity: 0.6;
  pointer-events: none;
}

[dir="rtl"] .page-size__input {
  padding: 0 1rem 0 2rem;
}

[dir="rtl"] .page-size__chevron {
  right: auto;
  left: 0.9rem;
}
</style>
