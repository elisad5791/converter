import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import MainPage from '../components/MainPage.vue';
import InfoPage from '../components/InfoPage.vue';
import AboutPage from '../components/AboutPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/info',
    name: 'InfoPage',
    component: InfoPage
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: AboutPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;