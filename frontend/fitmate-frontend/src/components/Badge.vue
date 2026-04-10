<template>
  <span class="badge" :class="[variantClass, sizeClass]">
    <slot></slot>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default' // default, outline, solid
  },
  size: {
    type: String,
    default: 'md'
  }
})

const variantClass = computed(() => {
  const variants = {
    default: 'badge-default',
    outline: 'badge-outline',
    solid: 'badge-solid'
  }
  return variants[props.variant] || variants.default
})

const sizeClass = computed(() => {
  return props.size === 'sm' ? 'badge-sm' : 'badge-md'
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  border-radius: 9999px;
}

.badge-sm {
  padding: 2px 8px;
  font-size: 11px;
}

.badge-md {
  padding: 4px 12px;
  font-size: 12px;
}

.badge-default {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: white;
}

.badge-outline {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.badge-solid {
  background: #1f2937;
  color: white;
}
</style>