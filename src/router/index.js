import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/home',
      name: 'homePage',
      component: HomePage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/fenceDetails/:id',
      name: 'fenceDetails',
      component: () => import('../views/fence/cottonDetail/CottonDetail.vue'),
      props: true,
    },
    {
      path: '/factoryDetails/:id',
      name: 'factoryDetails',
      component: () => import('../views/factory/factoryDetail/FactoryDetail.vue'),
      props: true,
    },
  ],
})

export default router
