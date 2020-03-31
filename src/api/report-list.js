import axios from '../assets/js/axios'
import path from '../assets/js/path'

export function getReportList (page, limit) {
  return axios.post(path.reportList.default, {
    page,
    limit
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
