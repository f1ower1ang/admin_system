import axios from '../assets/js/axios'
import path from '../assets/js/path'

export function getCards (limit, page, initiator) {
  return axios.post(path.home.aptList, { limit, page, initiator }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getCategory () {
  return axios.post(path.home.category).then(res => Promise.resolve(res.data))
}

export function getCountry (data) {
  return axios.post(path.home.country, data).then(res => Promise.resolve(res.data))
}
