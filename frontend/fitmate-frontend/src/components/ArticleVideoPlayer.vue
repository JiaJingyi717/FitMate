<template>
  <div class="article-video-player">
    <video
      v-if="source.kind === 'direct'"
      class="video-element"
      :src="source.playUrl"
      controls
      playsinline
      preload="metadata"
      :poster="poster || undefined"
    >
      您的浏览器不支持 HTML5 视频播放。
    </video>

    <iframe
      v-else-if="source.kind === 'embed'"
      class="video-iframe"
      :src="source.embedUrl"
      title="视频播放"
      frameborder="0"
      allowfullscreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />

    <div v-else class="video-fallback">
      <p v-if="source.kind === 'empty'">暂无视频地址，请在后台为本文配置 <code>videoUrl</code>。</p>
      <p v-else>无法识别的视频链接，请使用 MP4 直链、B 站或 YouTube 链接。</p>
      <p v-if="source.playUrl" class="fallback-url">{{ source.playUrl }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { resolveVideoSource } from '../utils/videoSource'

const props = defineProps({
  videoUrl: { type: String, default: '' },
  poster: { type: String, default: '' },
})

const source = computed(() => resolveVideoSource(props.videoUrl))
</script>

<style scoped>
.article-video-player {
  width: 100%;
  background: #0f172a;
  border-radius: 12px;
  overflow: hidden;
}

.video-element,
.video-iframe {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 480px;
  background: #000;
}

.video-fallback {
  padding: 32px 24px;
  color: #e2e8f0;
  text-align: center;
  font-size: 14px;
  line-height: 1.6;
}

.fallback-url {
  margin-top: 12px;
  word-break: break-all;
  color: #94a3b8;
  font-size: 12px;
}
</style>
