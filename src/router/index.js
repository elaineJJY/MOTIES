import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/trip',
    name: 'Trip',
    component: () => import(/* webpackChunkName: "about" */ '../components/trip-table.vue')
  },
  {
    path: '/station',
    name: 'Trip',
    component: () => import(/* webpackChunkName: "about" */ '../components/trip-table.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
