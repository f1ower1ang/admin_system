import axios from '../assets/js/axios'
import path from '../assets/js/path'

export function searchTtp(name, page, limit, techniques) {
  return axios.post(path.search.ttp, { name, page, limit, techniques }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function searchIoc(keyword) {
  return axios.post(path.search.ioc, { keyword }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function searchReport(keywords, limit, page) {
  return axios.post(path.search.report, { keywords, page, limit }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getTtpSelector () {
  return axios.get(path.search.ttpSelector).then(res => Promise.resolve(res.data))
}
