<template>
  <div class="base-input-wrap">
    <label v-if="label" :for="inputId" class="base-input__label">{{ label }}</label>
    <div class="base-input__field-wrap">
      <img v-if="icon" :src="icon" alt="" class="base-input__icon" width="16" height="16" />
      <input
        :id="inputId"
        v-bind="$attrs"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="['base-input__field', { 'has-icon': icon, 'is-invalid': error, 'is-valid': valid }]"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <slot name="append" />
    </div>
    <p v-if="error" class="base-input__error">{{ error }}</p>
    <p v-else-if="hint" class="base-input__hint">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue:  { type: [String, Number], default: '' },
  label:       { type: String, default: '' },
  type:        { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  icon:        { type: String, default: '' },
  error:       { type: String, default: '' },
  hint:        { type: String, default: '' },
  valid:       { type: Boolean, default: false },
  disabled:    { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
defineOptions({ inheritAttrs: false })

const inputId = computed(() =>
  props.label ? 'input-' + props.label.replace(/\s+/g, '-').toLowerCase() : undefined
)
</script>

<style scoped>
.base-input-wrap { display: flex; flex-direction: column; gap: 0.35rem; }
.base-input__label { font-size: 0.84rem; font-weight: 600; color: #2B2B2B; }
.base-input__field-wrap { position: relative; }
.base-input__icon {
  position: absolute; left: 0.85rem; top: 50%;
  transform: translateY(-50%); opacity: 0.4; pointer-events: none; z-index: 1;
}
.base-input__field {
  width: 100%; height: 46px;
  padding: 0 0.9rem 0 2.5rem;
  border: 1.5px solid #D8CFC6; border-radius: 0.5rem;
  font-size: 0.9rem; color: #2B2B2B; background: #FDFBF7;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
.base-input__field:not(.has-icon) { padding-left: 0.9rem; }
.base-input__field::placeholder { color: #B8AFA6; }
.base-input__field:focus { background:#fff; border-color:#1A2E40; box-shadow: 0 0 0 3px rgba(26,46,64,0.15); }
.base-input__field.is-invalid { border-color: #800020; box-shadow: 0 0 0 3px rgba(128,0,32,.1); }
.base-input__field.is-valid   { border-color: #198754; box-shadow: 0 0 0 3px rgba(25,135,84,.1); }
.base-input__error { font-size: 0.78rem; color: #800020; margin: 0; }
.base-input__hint  { font-size: 0.78rem; color: #6C757D; margin: 0; }
</style>
