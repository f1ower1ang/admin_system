import path from '../assets/js/path'
import Mock from 'mockjs'

Mock.mock(path.user.login, 'post', ({ body }) => {
  const user = JSON.parse(body)
  if (user.userName === 'root' && user.password === 'root') {
    return require('./json/login')
  }
})

Mock.mock(path.user.logout, 'get', () => {
  return {
    code: 0
  }
})

Mock.mock(path.home.aptList, 'post', ({ body }) => {
  const { limit, page } = JSON.parse(body)

  const data = require('./json/apts_findAll')
  let ret = []
  if (limit * page < data.count) {
    ret = data.data.slice((page - 1) * limit, page * limit)
  } else {
    ret = data.data.slice((page - 1) * limit)
  }

  return {
    code: 0,
    data: ret,
    msg: 'SUCCESS',
    count: data.count
  }
})

Mock.mock(path.home.category, 'post', require('./json/apts_getAptsInitiators'))

Mock.mock(RegExp(path.detail.overview + '.*'), 'post', require('./json/apts_findOneByName'))

Mock.mock(path.detail.charts, 'post', require('./json/report_findAll'))

Mock.mock(path.detail.ttp.default, 'post', ({ body }) => {
  body = JSON.parse(body)
  const years = []
  const ret = []
  let start
  let end
  if (body.startDate) {
    start = Number(body.startDate.substr(0, 4))
    end = Number(body.endDate.substr(0, 4))
    for (let i = start; i <= end; i++) {
      years.push(i)
    }
  }
  const { data } = require('./json/getChartsByAPT(1)')
  if (start) {
    data.forEach((item) => {
      let children = item.children.filter((child) => {
        return years.indexOf(Number(child.date.split('-')[0])) > -1
      })
      if (children.length > 0) {
        item.children = children
        ret.push(item)
      }
    })
    return {
      data: ret,
      code: 0
    }
  } else {
    return require('./json/getChartsByAPT(1)')
  }
})

Mock.mock(path.detail.ttp.strategy, 'post', require('./json/tactics_findAll'))

Mock.mock(path.detail.ioc.default, 'post', require('./json/trees_getTrees'))

Mock.mock(RegExp(path.detail.ioc.email + '.*'), 'post', require('./json/emails_getInfosFromEmail'))

Mock.mock(RegExp(path.detail.ioc.domain + '.*'), 'post', ({ body }) => {
  return require('./json/domains_getInfosFromDomain')
})

Mock.mock(RegExp(path.detail.ioc.ip + '.*'), 'post', require('./json/ips_getInfosFromIp'))

Mock.mock(RegExp(path.detail.ioc.sample + '.*'), 'post', require('./json/samples_getInfosFromSample'))

Mock.mock(RegExp(path.detail.ioc.url + '.*'), 'post', require('./json/urls_getInfosFromUrl'))

Mock.mock(path.search.report, 'post', ({ body }) => {
  console.log(body)
  return require('./json/report_search')
})

Mock.mock(path.search.ttpSelector, 'get', require('./json/techniques_getTechTable'))

Mock.mock(path.search.ioc, 'post', require('./json/ioc_search'))

Mock.mock(path.overview.apt, 'post', require('./json/report_findAll'))

Mock.mock(path.overview.statistics, 'post', require('./json/getStatistics'))

Mock.mock(path.overview.ip, 'post', ({ body }) => {
  const { apt } = JSON.parse(body)
  const { data } = require('./json/ips_findAll')
  const ret = []
  data.forEach((item) => {
    if (item.apt === apt) {
      ret.push(item)
    }
  })
  return {
    data: ret,
    code: 0
  }
})

Mock.mock(path.overview.cve, 'post', ({ body }) => {
  const { apt } = JSON.parse(body)
  const { data } = require('./json/cves_findAll')
  const ret = []
  data.forEach((item) => {
    if (item.apt === apt) {
      ret.push(item)
    }
  })
  return {
    data: ret,
    code: 0
  }
})

Mock.mock(path.overview.fileName, 'post', ({ body }) => {
  const { apt } = JSON.parse(body)
  const { data } = require('./json/fileNames_findAll')
  const ret = []
  data.forEach((item) => {
    if (item.apt === apt) {
      ret.push(item)
    }
  })
  return {
    data: ret,
    code: 0
  }
})

Mock.mock(path.overview.domain, 'post', ({ body }) => {
  const { apt } = JSON.parse(body)
  const { data } = require('./json/domains_findAll')
  const ret = []
  data.forEach((item) => {
    if (item.apt === apt) {
      ret.push(item)
    }
  })
  return {
    data: ret,
    code: 0
  }
})

Mock.mock(path.overview.email, 'post', ({ body }) => {
  const { apt } = JSON.parse(body)
  const { data } = require('./json/emails_findAll')
  const ret = []
  data.forEach((item) => {
    if (item.apt === apt) {
      ret.push(item)
    }
  })
  return {
    data: ret,
    code: 0
  }
})

Mock.mock(path.overview.filePath, 'post', ({ body }) => {
  const { apt } = JSON.parse(body)
  const { data } = require('./json/filePaths_findAll')
  const ret = []
  data.forEach((item) => {
    if (item.apt === apt) {
      ret.push(item)
    }
  })
  return {
    data: ret,
    code: 0
  }
})

Mock.mock(path.overview.registry, 'post', ({ body }) => {
  const { apt } = JSON.parse(body)
  const { data } = require('./json/registries_findAll')
  const ret = []
  data.forEach((item) => {
    if (item.apt === apt) {
      ret.push(item)
    }
  })
  return {
    data: ret,
    code: 0
  }
})

Mock.mock(path.overview.url, 'post', ({ body }) => {
  const { apt } = JSON.parse(body)
  const { data } = require('./json/urls_findAll')
  const ret = []
  data.forEach((item) => {
    if (item.apt === apt) {
      ret.push(item)
    }
  })
  return {
    data: ret,
    code: 0
  }
})

Mock.mock(path.overview.sample, 'post', ({ body }) => {
  const { apt } = JSON.parse(body)
  const { data } = require('./json/samples_findAll')
  const ret = []
  data.forEach((item) => {
    if (item.apt === apt) {
      ret.push(item)
    }
  })
  return {
    data: ret,
    code: 0
  }
})

Mock.mock(path.reportList.default, 'post', require('./json/report_findAll'))
