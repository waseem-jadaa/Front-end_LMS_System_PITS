import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../modules/Dashboard/view/DashboardView.vue'
import AuthView from '../modules/Auth/view/AuthView.vue'
import ForgotPasswordView from '../modules/Auth/view/ForgotPasswordView.vue'
import ResetPasswordView from '../modules/Auth/view/ResetPasswordView.vue'
import MembersView from '../modules/Members/view/MembersView.vue'
import BooksView from '../modules/Books/view/BooksView.vue'
import BorrowingsView from '../modules/Borrowings/view/BorrowingsView.vue'
import { useAuthStore } from '../modules/Auth/store/authStore'
import { ROLES } from '../core/utils/constants'

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
    meta: { guestOnly: true }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
    meta: { guestOnly: true }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView,
    meta: { guestOnly: true }
  },
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/members',
    name: 'members',
    component: MembersView,
    meta: { requiresAuth: true, roles: [ROLES.ADMIN] }
  },
  {
    path: '/books',
    name: 'books',
    component: BooksView,
    meta: { requiresAuth: true, roles: [ROLES.ADMIN, ROLES.MEMBER] }
  },
  {
    path: '/borrowings',
    name: 'borrowings',
    component: BorrowingsView,
    meta: { requiresAuth: true, roles: [ROLES.ADMIN, ROLES.MEMBER] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'auth' }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated && !authStore.isGuest) {
    return { name: 'dashboard' }
  }

  if (to.meta.roles && !to.meta.roles.includes(authStore.role)) {
    return { name: 'dashboard' }
  }
})

export default router
