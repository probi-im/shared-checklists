import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import PublicChecklists from '../views/PublicChecklists.vue'
import PrivateChecklists from '../views/PrivateChecklists.vue'
import Checklist from '../views/Checklist.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import { auth } from '@/firebase'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: 'home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/public',
    name: 'Public Checklists',
    component: PublicChecklists
  },
  {
    path: '/private',
    name: 'Private Checklists',
    component: PrivateChecklists,
    meta: {
      // requiresAuth: true
    }
  },
  {
    path: '/checklist',
    name: 'Checklist',
    component: Checklist,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  if (requiresAuth && !auth.currentUser) {
    next('login')
  } else {
    next()
  }
})

export default router
