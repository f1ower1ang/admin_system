import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/aptList',
      name: 'aptList',
      meta: {
        requireAuth: true
      },
      component: () => import('./views/Home/Home.vue')
    },
    {
      path: '/detail',
      name: 'detail',
      meta: {
        requireAuth: true
      },
      component: () => import('./views/Detail/Map.vue'),
      children: [{
        name: 'ttp',
        path: '/detail/ttp',
        component: () => import('./views/Detail/Ttp.vue')
      }, {
        name: 'ioc',
        path: '/detail/ioc',
        component: () => import('./views/Detail/Ioc.vue')
      }]
    },
    {
      path: '/search',
      name: 'search',
      meta: {
        requireAuth: true
      },
      component: () => import('./views/Search/Search')
    },
    {
      name: 'ioc',
      path: '/ioc',
      component: () => import('./views/Search/Ioc')
    },
    {
      name: 'ttp',
      path: '/ttp',
      component: () => import('./views/Search/Ttp')
    },
    {
      name: 'report',
      path: '/report',
      component: () => import('./views/Home/Report')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login/Login')
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        requireAuth: true
      },
      component: () => import('./views/Overview/Overview')
    },
    {
      path: '/reportList',
      name: 'reportList',
      meta: {
        requireAuth: true
      },
      component: () => import('./views/ReportList/ReportList')
    }
  ]
})
