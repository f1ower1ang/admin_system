import axios from 'axios'
import path from '../assets/js/path'

export function login({ username, password }) {
  return axios.post(path.user.login, {
    userName: username,
    password
  }).then(res => {
    if (res.headers['x-auth-token']) {
      sessionStorage.token = res.headers['x-auth-token']
    }
    return Promise.resolve(res.data)
  })
}

export function logout () {
  return axios.get(path.user.logout).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getCurrentUser () {
  return axios.get(path.user.current).then(res => {
    return Promise.resolve(res.data)
  })
}

export function editUser(data) {
  return axios.post(path.user.editUser, data).then(res => {
    return Promise.resolve(res.data)
  })
}
