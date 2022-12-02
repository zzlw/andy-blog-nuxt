<template>
  <div>
    <div id="app" class="app-container">
      <page-header :navList="navList"></page-header>
      <main class="view">
        <transition name="fade-transform"
                    mode="out-in">
          <nuxt />
        </transition>
      </main>
      <page-footer :navList="navList"></page-footer>
      <transition name="search-slide">
        <page-search v-if="isShowSearch"></page-search>
      </transition>
      <scroll-top></scroll-top>
    </div>
    <div id="aplayer"></div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import PageHeader from '@/components/layout/page-header/page-header'
import PageFooter from '@/components/layout/page-footer/page-footer'
import PageSearch from '@/components/layout/page-search/page-search'
import ScrollTop from '@/components/layout/scroll-top/scroll-top'

const navList = [
  {
    link: "/",
    name: "首页"
  },
  {
    link: "/archive",
    name: "归档"
  },
  {
    link: "/sitemap",
    name: "标签"
  },
  {
    link: "/about",
    name: "关于"
  },
  {
    link: "/messages",
    name: "留言墙"
  }
];

export default {
  components: {
    PageHeader,
    PageFooter,
    PageSearch,
    ScrollTop
  },

  data() {
    return {
      navList
    }
  },

  computed: {
    isShowSearch() {
      const is = this.$store.state.app.isShowSearch
      if (process.client) {
        document.documentElement.style.overflowY = is ? 'hidden' : 'visible'
      }
      return is
    }
  },

  methods: {
    ...mapMutations({
      setTheme: 'app/setTheme'
    })
  },

  mounted() {
    const theme = window.localStorage.getItem('THEME')
    this.setTheme(theme || 'light')
    const ap = new window.APlayer({
      container: window.document.getElementById('aplayer'),
      fixed: true,
      theme: '#e9e9e9',
      audio: [
        {
          name: '喜欢你',
          artist: 'G.E.M.邓紫棋',
          url: 'https://resource.jiawen.live/blog/G.E.M.%E9%82%93%E7%B4%AB%E6%A3%8B-%E5%96%9C%E6%AC%A2%E4%BD%A0.mp3',
          cover: 'https://resource.jiawen.live/blog/img/timg.jpeg'
        },
        {
          name: 'Cheap Thrills',
          artist: 'Sia + Sean Paul',
          url: 'https://resource.jiawen.live/blog/Sia%20%2B%20Sean%20Paul-Cheap%20Thrills.mp3',
          cover: 'https://resource.jiawen.live/blog/asdf-avatar.jpg'
        },
        {
          name: 'Señorita',
          artist: 'Shawn Mendes + Camila Cabello',
          url: 'https://resource.jiawen.live/blog/Shawn%20Mendes%20%2B%20Camila%20Cabello-Sen%CC%83orita.mp3',
          cover: 'https://resource.jiawen.live/blog/asdfaf.png'
        },
        {
          name: 'We Don\'t Talk Anymore',
          artist: 'Sam Tsui + Alex G-Don\'t Wanna Know',
          url: 'https://resource.jiawen.live/blog/Sam%20Tsui%20%2B%20Alex%20G-Don%27t%20Wanna%20Know%20%2B%20We%20Don%27t%20Talk%20Anymore.m4a',
          cover: 'https://resource.jiawen.live/blog/_MG_0847.JPG'
        },
        {
          name: 'Happier',
          artist: 'Marshmellow + Bastille',
          url: 'https://resource.jiawen.live/blog/Marshmellow%20%2B%20Bastille-Happier.mp3',
          cover: 'https://resource.jiawen.live/blog/asdf-avatar.jpg'
        },
        {
          name: 'Bomba (Radio Edit) (Remix Klass)',
          artist: 'Jessy Matador',
          url: 'https://resource.jiawen.live/blog/Jessy%20Matador-Bomba%20%28Radio%20Edit%29%20%28Remix%20Klass%29.m4a',
          cover: 'https://resource.jiawen.live/blog/asdf-avatar.jpg'
        }
      ]
    })
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/animation.scss";

.app-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}

.view {
  flex: 1;
}
</style>

