import axios from '../assets/js/axios'
import path from '../assets/js/path'

export function getOverview (name) {
  let url = `${path.detail.overview}?name=${name}`
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getCharts (apt, limit) {
  return axios.post(path.detail.charts, {
    apt,
    limit
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getDefaultTtp (apt) {
  return axios.post(path.detail.ttp.default, {
    apt,
    limit: 1000
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getStrategyDetail () {
  return axios.post(path.detail.ttp.strategy, {
    page: 1,
    limit: 90
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getTtpTech(apt, minYear, maxYear) {
  return axios.post(path.detail.ttp.technique, {
    startDate: `${minYear}-1-1`,
    endDate: `${maxYear}-12-31`,
    limit: 1000,
    apt
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getTtpPrs (apt, minYear, maxYear) {
  return axios.post(path.detail.ttp.process, {
    apt,
    startDate: `${minYear}-1-1`,
    endDate: `${maxYear}-12-31`,
    limit: 1000
  }).then(res => Promise.resolve(res.data))
}

export function getIocDir (name) {
  return axios.post(path.detail.ioc.default, {
    name,
    limit: 10000
  }).then(res => Promise.resolve(res.data))
}

export function getIocEmail (email) {
  let formData = new FormData()
  formData.append('email', email)
  return axios.post(path.detail.ioc.email, formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(res => Promise.resolve(res.data))
}

export function getIocDomain (domain) {
  let formData = new FormData()
  formData.append('domain', domain)
  return axios.post(path.detail.ioc.domain, formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(res => Promise.resolve(res.data))
}

export function getIocIp (ip) {
  let formData = new FormData()
  formData.append('ip', ip)
  return axios.post(path.detail.ioc.ip, formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(res => Promise.resolve(res.data))
}

export function getIocSample (sample) {
  let formData = new FormData()
  formData.append('sample', sample)
  return axios.post(path.detail.ioc.sample, formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(res => Promise.resolve(res.data))
}

export function getIocUrl (url) {
  let formData = new FormData()
  formData.append('url', url)
  return axios.post(path.detail.ioc.url, formData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(res => Promise.resolve(res.data))
}
