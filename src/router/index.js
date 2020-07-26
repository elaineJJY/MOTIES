import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/trip',
    name: 'Trip',
    component: () => import('../views/Trip.vue')
  },
  {
    path: '/station',
    name: 'Trip',
    component: () => import('../views/Trip.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
