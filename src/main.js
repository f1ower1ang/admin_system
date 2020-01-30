import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import echarts from 'echarts'
import './assets/stylus/index.styl'
import './plugins/element.js'

if (process.env.NODE_ENV === 'development') {
  require('./mock')
}

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (sessionStorage.token) {
      next()
    } else {
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
