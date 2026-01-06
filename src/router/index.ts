import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HyphenStringView from '../views/HyphenStringView.vue'
import URLDecoderView from '../views/URLDecoderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/hyphen-string',
      name: 'hyphenString',
      component: HyphenStringView,
    },
    {
      path: '/url-decoder',
      name: 'urlDecoder',
      component: URLDecoderView,
    },
  ],
})

export default router
