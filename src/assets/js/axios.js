import axios from 'axios'
import router from '../../router'

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (sessionStorage.token) {
      config.headers['x-auth-token'] = sessionStorage.token // 将token设置成请求头
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code === 500104) {
      sessionStorage.token = ''
      router.push('/login')
    } else if (response.headers['x-auth-token']) {
      sessionStorage.setItem('token', response.headers['x-auth-token'])
      sessionStorage.token = response.headers['x-auth-token']
    }
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default axios
