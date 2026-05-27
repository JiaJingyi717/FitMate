/**
 * 解析文章 videoUrl，支持：直链 MP4/WebM、本站静态路径、B 站、YouTube。
 */

const BILIBILI_BV_RE = /(?:bilibili\.com\/video\/|bvid=)(BV[\w]+)/i
const YOUTUBE_RE = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/i
const DIRECT_VIDEO_RE = /\.(mp4|webm|ogg|m4v)(\?.*)?$/i

export function resolveVideoSource(url) {
  const raw = (url || '').trim()
  if (!raw) {
    return { kind: 'empty', playUrl: '', embedUrl: '' }
  }

  const bilibili = raw.match(BILIBILI_BV_RE)
  if (bilibili) {
    const bvid = bilibili[1]
    return {
      kind: 'embed',
      playUrl: raw,
      embedUrl: `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1&autoplay=0`,
      provider: 'bilibili',
    }
  }

  const youtube = raw.match(YOUTUBE_RE)
  if (youtube) {
    return {
      kind: 'embed',
      playUrl: raw,
      embedUrl: `https://www.youtube.com/embed/${youtube[1]}`,
      provider: 'youtube',
    }
  }

  if (DIRECT_VIDEO_RE.test(raw) || raw.startsWith('/')) {
    return { kind: 'direct', playUrl: raw, embedUrl: '', provider: 'file' }
  }

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return { kind: 'direct', playUrl: raw, embedUrl: '', provider: 'file' }
  }

  return { kind: 'unsupported', playUrl: raw, embedUrl: '' }
}
