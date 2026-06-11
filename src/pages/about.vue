<template>
  <div class="about-page">
    <div class="module author-module">
      <h1 class="page-title">关于</h1>
      <Loading v-if="authorsStore.fetching && !authors.length" />
      <div v-for="author in authors" :key="author.id" class="author-card">
        <img v-if="author.avatar" class="avatar" :src="resolveStaticUrl(author.avatar)" :alt="author.name" />
        <div class="info">
          <h2 class="name">{{ author.name }}</h2>
          <p class="desc">{{ author.description || APP_META.description }}</p>
          <p v-if="author.email" class="email">
            <a :href="`mailto:${author.email}`">{{ author.email }}</a>
          </p>
        </div>
      </div>
    </div>

    <div v-if="friends.length" class="module friends-module">
      <h3 class="section-title">友情链接</h3>
      <div class="friend-list">
        <a
          v-for="friend in friends"
          :key="friend.id"
          :href="friend.link"
          class="friend-item"
          target="_blank"
          rel="external nofollow noopener"
        >
          <img v-if="friend.avatar" class="friend-avatar" :src="resolveStaticUrl(friend.avatar)" :alt="friend.name" />
          <span class="friend-name">{{ friend.name }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useAuthorsStore, useFriendsStore } from '/@/stores/meta'
import { useUniversalFetch } from '/@/app/universal'
import { APP_META, pageTitle } from '/@/configs/app.config'
import { resolveStaticUrl } from '/@/transforms/url'
import Loading from '/@/components/common/loading.vue'

const authorsStore = useAuthorsStore()
const friendsStore = useFriendsStore()
const authors = computed(() => authorsStore.data)
const friends = computed(() => friendsStore.data)

useHead({ title: pageTitle('关于') })

useUniversalFetch(() => Promise.all([authorsStore.fetch(), friendsStore.fetch()]))
</script>

<style lang="scss" scoped>
.about-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--color-text-darker);
  margin-bottom: $gap-lg;
}

.author-card {
  display: flex;
  gap: $gap-lg;
  align-items: center;

  & + .author-card {
    margin-top: $gap-lg;
    padding-top: $gap-lg;
    border-top: 1px dashed var(--color-text-divider);
  }
}

.avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  font-size: 1.15rem;
  color: var(--color-text-darker);
}

.desc {
  margin-top: 0.4em;
  color: var(--color-text-secondary);
}

.email {
  margin-top: 0.4em;
  font-size: 0.85rem;

  a:hover {
    color: var(--color-primary);
  }
}

.section-title {
  margin-bottom: $gap;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text-darker);
  border-left: 3px solid var(--color-primary);
  padding-left: 0.55em;
  line-height: 1.2;
}

.friend-list {
  display: flex;
  flex-wrap: wrap;
  gap: $gap;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.4em 0.9em;
  border-radius: 2em;
  background-color: var(--module-bg-darker-1);
  transition: all 0.2s;

  &:hover {
    color: var(--color-text-reversal);
    background-color: var(--color-primary);
  }
}

.friend-avatar {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  object-fit: cover;
}
</style>
