<template>
  <button 
    :class="['btn', `btn-${variant}`, sizeClass, { 'w-100': block }]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary' 
  },
  size: {
    type: String,
    default: 'md' 
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'btn-sm';
  if (props.size === 'lg') return 'btn-lg';
  return '';
});
</script>

<style scoped>

.btn {
  transition: all 0.2s ease-in-out;
  font-weight: 500;
}
</style>
