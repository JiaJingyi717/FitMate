<template>
  <div class="tabs">
    <div class="tabs-header">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: modelValue === tab.value }"
        @click="$emit('update:modelValue', tab.value)"
      >
        <slot :name="'tab-' + tab.value"></slot>
        {{ tab.label }}
      </button>
    </div>
    <div class="tabs-content">
      <slot :name="modelValue"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.tabs {
  width: 100%;
}

.tabs-header {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0;
}

.tab-item {
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.2s ease;
}

.tab-item:hover {
  color: #2563eb;
}

.tab-item.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.tabs-content {
  padding-top: 16px;
}
</style>