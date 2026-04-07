<template>
  <button
    class="btn"
    :class="[
      variantClass,
      sizeClass,
      { 'opacity-60 cursor-not-allowed': disabled }
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default' // default, outline, ghost
  },
  size: {
    type: String,
    default: 'md' // sm, md, lg
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const variantClass = computed(() => {
  const variants = {
    default: 'btn-default',
    outline: 'btn-outline',
    ghost: 'btn-ghost'
  }
  return variants[props.variant] || variants.default
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  }
  return sizes[props.size] || sizes.md
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-md {
  padding: 10px 20px;
  font-size: 14px;
}

.btn-lg {
  padding: 12px 24px;
  font-size: 16px;
}

.btn-default {
  background: linear-gradient(135deg, #2563eb, #06b6d4);
  color: white;
}

.btn-default:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8, #0891b2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-outline {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover:not(:disabled) {
  border-color: #2563eb;
  color: #2563eb;
  background: #eff6ff;
}

.btn-ghost {
  background: transparent;
  color: #6b7280;
}

.btn-ghost:hover:not(:disabled) {
  background: #f3f4f6;
  color: #374151;
}
</style>