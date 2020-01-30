import axios from '../assets/js/axios'
import path from '../assets/js/path'

export function getApts (page, limit) {
  return axios.post(path.overview.apt, {
    page,
    limit,
    isIndex: true
  }).then(res => Promise.resolve(res.data))
}

export function getMaps (page, limit) {
  return axios.post(path.overview.map, {
    page,
    limit
  }).then(res => Promise.resolve(res.data))
}

export function getProcess (apt) {
  return axios.post(path.overview.process, {
    apt,
    limit: 1000
  }).then(res => Promise.resolve(res.data))
}

export function getStatistics () {
  return axios.post(path.overview.statistics).then(res => Promise.resolve(res.data))
}

export function getListData (type, page, limit, apt) {
  return axios.post(path.overview[type], {
    page,
    limit,
    apt
  }).then(res => Promise.resolve(res.data))
}
