<template>
  <div :class="['base-card', { 'base-card--hoverable': hoverable, 'base-card--flat': flat }]">
    <div v-if="$slots.header" class="base-card__header">
      <slot name="header" />
    </div>
    <div class="base-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  hoverable: { type: Boolean, default: false },
  flat:      { type: Boolean, default: false }
})
</script>

<style scoped>
.base-card {
  background: #fff;
  border: 1px solid #E6DBCC;
  border-radius: 1rem;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(26,46,64,0.06);
}
.base-card--hoverable:hover {
  box-shadow: 0 8px 28px rgba(26,46,64,0.14);
  transform: translateY(-2px);
}
.base-card--flat { box-shadow: none; }
.base-card__header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #F0E8DC;
  background: #FDFBF7;
}
.base-card__body   { padding: 1.25rem; }
.base-card__footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #F0E8DC;
  background: #FDFBF7;
}
</style>
