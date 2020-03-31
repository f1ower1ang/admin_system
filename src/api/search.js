import axios from '../assets/js/axios'
import path from '../assets/js/path'

export function searchTtp(name, page, limit, techniques) {
  return axios.post(path.search.ttp, { name, page, limit, techniques }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function searchIoc(keyword, expandType, userName, searchId) {
  return axios.post(path.search.ioc, { keyword, expandType, userName, searchId }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function searchReport(keywords, limit, page, params) {
  const data = {
    keywords,
    limit,
    page
  }
  if (params) {
    Object.assign(data, params)
  }
  return axios.post(path.search.report, data).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getTtpSelector (terminalType) {
  return axios.post(path.search.ttpSelector, { terminalType }).then(res => Promise.resolve(res.data))
}

export function searchRecord(userName, limit, page) {
  return axios.post(path.search.iocRecord, { userName, limit, page }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function searchRecordEdit(userName, id, name) {
  return axios.post(path.search.searchRecordEdit, { userName, id, name }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function searchRecordDelete(userName, id) {
  return axios.post(path.search.searchRecordDelete, { userName, id }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function searchExpand(userName, limit, page, searchId) {
  return axios.post(path.search.iocExpand, { userName, limit, page, searchId }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function ExpandDelete(userName, searchId) {
  return axios.post(path.search.iocExpandDelete, { userName, searchId }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function searchExpandDelete(userName, id, searchId) {
  return axios.post(path.search.iocExpandDelete, { userName, id, searchId }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function searchID(userName, value) {
  return axios.post(path.search.searchID, { userName, value }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function iocRelationTag(searchId, userName, source, target, name) {
  return axios.post(path.search.iocRelationTag, { searchId, userName, source, target, name }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 修改Tag接口
export function EditTag(id, name) {
  return axios.post(path.search.EditTag, { id, name }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 删除接口
export function DeleteTag(id) {
  return axios.post(path.search.DeleteTag, { id }).then(res => {
    return Promise.resolve(res.data)
  })
}

// Tag Id
export function TagId(searchId, userName, name, source, target) {
  return axios.post(path.search.TagId, { searchId, userName, name, source, target }).then(res => {
    return Promise.resolve(res.data)
  })
}
// 修改2
export function Back(userName, keyword, expandType, rollbackId, searchId, rollback) {
  return axios.post(path.search.ioc, { userName, keyword, expandType, rollbackId, searchId, rollback }).then(res => {
    return Promise.resolve(res.data)
  })
}
