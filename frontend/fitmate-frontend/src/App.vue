<template>
  <Layout v-if="showLayout">
    <router-view />
  </Layout>
  <router-view v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Layout from './components/Layout.vue'

const route = useRoute()

// 不需要 Layout 的页面（登录、注册等）
const noLayoutPages = ['/login', '/register']

const showLayout = computed(() => {
  return !noLayoutPages.includes(route.path)
})
</script>

<style>
@import './styles/global.css';
</style>