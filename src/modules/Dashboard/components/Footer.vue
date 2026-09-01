<template>
  <footer class="text-center py-4 mt-5 border-top text-muted small footer-wrapper" dir="ltr">
    <p class="mb-1 font-serif footer-text" :dir="dir">{{ t('dashboard.footer.text') }}</p>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
const dir = computed(() => locale.value === 'ar' ? 'rtl' : 'ltr')
</script>

<style scoped>
.footer-wrapper {
  background-color: var(--bg-page);
  border-top-color: var(--border) !important;
}

.footer-text {
  font-family: Georgia, serif;
  color: var(--wood);
}
</style>
