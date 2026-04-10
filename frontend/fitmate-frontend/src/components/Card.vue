<template>
  <div class="card" :class="[customClass, gradientClass]">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  customClass: {
    type: String,
    default: ''
  },
  gradientClass: {
    type: String,
    default: 'bg-white'
  }
})
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
</style>