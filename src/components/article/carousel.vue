<template>
  <div v-if="articles.length" class="carousel module" @mouseenter="pause" @mouseleave="resume">
    <transition-group name="carousel-slide" tag="div" class="slides">
      <router-link
        v-for="(article, index) in articles"
        v-show="index === activeIndex"
        :key="article.id"
        :to="`/article/${article.id}`"
        class="slide"
      >
        <img class="slide-image" :src="resolveThumbnailUrl(article.cover, 1200)" :alt="article.title" />
        <div class="slide-title">
          <h2>{{ article.title }}</h2>
          <p>{{ article.description }}</p>
        </div>
      </router-link>
    </transition-group>
    <div class="indicators">
      <button
        v-for="(article, index) in articles"
        :key="article.id"
        class="indicator"
        :class="{ active: index === activeIndex }"
        @click="activeIndex = index"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { Article } from '/@/interfaces'
import { resolveThumbnailUrl } from '/@/transforms/url'
import { isClient } from '/@/configs/app.env'

const props = defineProps<{ articles: Article[] }>()

const activeIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const next = () => {
  if (!props.articles.length) return
  activeIndex.value = (activeIndex.value + 1) % props.articles.length
}

const resume = () => {
  if (isClient && !timer) {
    timer = setInterval(next, 4000)
  }
}

const pause = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

onMounted(resume)
onBeforeUnmount(pause)
</script>

<style lang="scss" scoped>
.carousel {
  position: relative;
  height: 14rem;
  overflow: hidden;
}

.slides {
  height: 100%;
}

.slide {
  position: absolute;
  inset: 0;
  display: block;

  .slide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .slide-title {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 2.5rem 1.2rem 0.9rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
    color: #fff;

    h2 {
      font-size: 1.2rem;
      @include text-overflow(1);
    }

    p {
      margin-top: 0.2em;
      font-size: 0.85rem;
      opacity: 0.85;
      @include text-overflow(1);
    }
  }
}

.indicators {
  position: absolute;
  right: 1rem;
  bottom: 0.8rem;
  z-index: 2;
  display: flex;
  gap: 0.4rem;
}

.indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  transition: all 0.2s;

  &.active {
    width: 1.2rem;
    border-radius: 0.25rem;
    background-color: #fff;
  }
}

.carousel-slide-enter-active,
.carousel-slide-leave-active {
  transition: opacity 0.6s ease;
}
.carousel-slide-enter-from,
.carousel-slide-leave-to {
  opacity: 0;
}
</style>
