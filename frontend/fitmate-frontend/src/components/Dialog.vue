<template>
  <Teleport to="body">
    <div v-if="show" class="dialog-overlay" @click.self="handleClose">
      <div class="dialog-content" :class="sizeClass">
        <div class="dialog-header">
          <h3 class="dialog-title">{{ title }}</h3>
          <button class="dialog-close" @click="handleClose">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="dialog-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md' // sm, md, lg, xl
  }
})

const emit = defineEmits(['update:show', 'close'])

const sizeClass = computed(() => `dialog-${props.size}`)

const handleClose = () => {
  emit('update:show', false)
  emit('close')
}

// ESC key to close
watch(() => props.show, (val) => {
  const handleEsc = (e) => {
    if (e.key === 'Escape' && props.show) {
      handleClose()
    }
  }
  if (val) {
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleEsc)
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.dialog-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: dialogEnter 0.3s ease;
}

@keyframes dialogEnter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.dialog-sm {
  width: 100%;
  max-width: 400px;
}

.dialog-md {
  width: 100%;
  max-width: 560px;
}

.dialog-lg {
  width: 100%;
  max-width: 720px;
}

.dialog-xl {
  width: 100%;
  max-width: 960px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.dialog-close {
  padding: 4px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.dialog-close:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.dialog-body {
  padding: 24px;
  overflow-y: auto;
}
</style>