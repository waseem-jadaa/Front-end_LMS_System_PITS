import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../modules/Dashboard/view/DashboardView.vue'
import AuthView from '../modules/Auth/view/AuthView.vue'

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: AuthView
  },
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
