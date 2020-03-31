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
      path: '/knowledge',
      name: 'knowledge',
      meta: {
        requireAuth: true
      },
      component: () => import('./views/Knowledge/index.vue')
    },
    {
      path: '/aptList',
      name: 'aptList',
      component: () => import('./views/AptList/index')
    },
    {
      path: '/detail',
      name: 'detail',
      meta: {
        requireAuth: true
      },
      component: () => import('./views/Detail/index.vue'),
      redirect: '/detail/map',
      children: [
        {
          name: 'detail-map',
          path: 'map',
          component: () => import('./views/Detail/Map.vue'),
          meta: {
            requireAuth: true
          }
        },
        {
          name: 'detail-ttp',
          path: 'ttp',
          component: () => import('./views/Detail/ttp/index'),
          redirect: '/detail/ttp/strategy',
          children: [{
            name: 'ioc-strategy',
            path: 'strategy',
            component: () => import('./views/Detail/ttp/TtpStrategy'),
            meta: {
              requireAuth: true
            }
          }, {
            name: 'ioc-technique',
            path: 'technique',
            component: () => import('./views/Detail/ttp/TtpTechnique'),
            meta: {
              requireAuth: true
            }
          }, {
            name: 'ioc-process',
            path: 'process',
            component: () => import('./views/Detail/ttp/TtpProcess'),
            meta: {
              requireAuth: true
            }
          }]
        },
        {
          name: 'detail-iocPage',
          path: '/detail/ioc',
          component: () => import('./views/Detail/IocPage.vue'),
          meta: {
            requireAuth: true
          }
          // component: () => import('./views/Detail/Ttp.vue')
        }]
    },
    {
      name: 'ioc',
      path: '/ioc',
      component: () => import('./views/Search/Ioc')
    },
    {
      name: 'ioc-result',
      path: '/ioc/result',
      component: () => import('./views/Search/IocResult')
    },
    {
      name: 'ttp',
      path: '/ttp',
      component: () => import('./views/Search/Ttp')
    },
    {
      name: 'ttp-result',
      path: '/ttp/result',
      component: () => import('./views/Search/TtpResult')
    },
    {
      name: 'report',
      path: '/report',
      component: () => import('./views/Search/Report')
    },
    {
      name: 'report-result',
      path: '/report/result',
      component: () => import('./views/Search/ReportResult')
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
    },
    {
      path: '/threatIntelligence',
      name: 'threatIntelligence',
      meta: {
        requireAuth: true
      },
      component: () => import('./views/ThreatIntelligence/ThreatIntelligence')
    },
    {
      path: '/threatIntelligence/ioc',
      name: 'threatIntelligenceIoc',
      meta: {
        requireAuth: true
      },
      component: () => import('./views/ThreatIntelligence/Ioc')
    },
    {
      path: '/threatIntelligence/ttp',
      name: 'threatIntelligenceTtp',
      meta: {
        requireAuth: true
      },
      component: () => import('./views/ThreatIntelligence/Ttp')
    }
  ]
})
