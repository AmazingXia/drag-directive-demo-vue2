import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'
import ChartPage from '../pages/ChartPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/chart',
    name: 'Chart',
    component: ChartPage
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router

