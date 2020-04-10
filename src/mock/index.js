import path from '../assets/js/path'
import Mock from 'mockjs'

Mock.mock(path.user.login, 'post', ({ body }) => {
  const user = JSON.parse(body)
  if (user.userName === 'root' && user.password === 'root') {
    return require('./json/login')
  } else {
    return {
      code: 500214,
      msg: '账号或密码错误'
    }
  }
})

Mock.mock(path.user.logout, 'get', () => {
  return {
    code: 0
  }
})

Mock.mock(path.user.editUser, 'post', ({ body }) => {
  console.log(body)
  return {
    code: 0
  }
})

Mock.mock(path.user.current, 'get', () => {
  return {
    code: 0,
    data: {
      'id': 1,
      'userName': 'root',
      'password': 'uS8l/BA+qGZ08PcXWRH94g==',
      'realName': '系统管理员',
      'telephone': '15011111110',
      'email': 'ss010@aa.com000',
      'addTime': '2019-10-09 11:31:49',
      'state': 1,
      'roleId': 1,
      'page': 1,
      'limit': 10,
      'startDate': '',
      'endDate': '',
      'rememberMe': ''
    }
  }
})

Mock.mock(path.home.aptList, 'post', ({ body }) => {
  console.log(body)
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

Mock.mock(path.home.country, 'post', ({ body }) => {
  console.log(body)
  const { page, limit } = JSON.parse(body)
  const res = require('./json/apts_getCountrys')
  let data = []
  if (page && limit) {
    data = res.data.slice((page - 1) * limit, page * limit)
  } else {
    data = res.data
  }
  return {
    data,
    count: res.count
  }
})

Mock.mock(RegExp(path.detail.overview + '.*'), 'post', (req) => {
  console.log(req)
  return require('./json/apts_findOneByName')
})

Mock.mock(path.detail.charts, 'post', ({ body }) => {
  console.log(body)
  return require('./json/report_findAll')
})

Mock.mock(path.detail.ttp.default, 'post', ({ body }) => {
  console.log(body)
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
  let data = []
  if (body.terminalType.indexOf('移动') > -1) {
    let data1 = require('./json/procedures_getChartsByAPT1').data
    let data2 = require('./json/procedures_getChartsByAPT2').data
    data.push(...data1, ...data2)
  } else {
    data = require('./json/procedures_getChartsByAPT').data
  }
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
    return {
      data
    }
  }
})

Mock.mock(path.detail.ttp.strategy, 'post', ({ body }) => {
  console.log(body)
  return require('./json/tactics_findAll')
})

Mock.mock(path.detail.ioc.default, 'post', require('./json/trees_getTrees'))

Mock.mock(path.detail.ioc.hash, 'post', (req) => {
  console.log(req)
  return require('./json/trees_getTreesBySource')
})

Mock.mock(RegExp(path.detail.ioc.email + '.*'), 'post', require('./json/emails_getInfosFromEmail'))

Mock.mock(RegExp(path.detail.ioc.domain + '.*'), 'post', ({ body }) => {
  return require('./json/domains_getInfosFromDomain')
})

Mock.mock(RegExp(path.detail.ioc.ip + '.*'), 'post', require('./json/ips_getInfosFromIp'))

Mock.mock(RegExp(path.detail.ioc.sample + '.*'), 'post', require('./json/samples_getInfosFromSample'))

Mock.mock(RegExp(path.detail.ioc.url + '.*'), 'post', require('./json/urls_getInfosFromUrl'))

Mock.mock(RegExp(path.detail.inspect + '.*'), 'get', require('./json/report_findOneByHash'))

Mock.mock(path.search.report, 'post', ({ body }) => {
  console.log(body)
  return require('./json/report_search')
})

Mock.mock(path.search.ttpSelector, 'post', ({ body }) => {
  console.log(body)
  body = JSON.parse(body)
  if (body.terminalType === 'PC') { return require('./json/techniques_getTechTable') } else if (body.terminalType === '移动设备') { return require('./json/techniques_getTechTable1') } else if (body.terminalType === '移动网络') { return require('./json/techniques_getTechTable2') }
})

Mock.mock(path.search.ioc, 'post', (req) => {
  console.log(req)
  return require('./json/ioc__search')
})

Mock.mock(path.search.iocRecord, 'post', require('./json/urnage.IocSearchRecord_findAll'))
Mock.mock(path.search.searchRecordEdit, 'post', require('./json/IocSearchRecord_editOne'))
Mock.mock(path.search.iocExpandDelete, 'post', require('./json/IocExpandRecord_delOne'))
Mock.mock(path.search.iocExpand, 'post', require('./json/urnage.com_iocExpandRecord_findAll'))
Mock.mock(path.search.searchID, 'post', require('./json/urnage.com_iocSearchRecord_findOneByEntity'))
Mock.mock(path.search.Back, 'post', require('./json/step3_ioc_search(1)'))
Mock.mock(path.search.iocRelationTag, 'post', require('./json/step3_ioc_search(1)'))
Mock.mock(path.search.EditTag, 'post', require('./json/urnage.com_iocSearchRecord_findOneByEntity'))
Mock.mock(path.search.DeleteTag, 'post', require('./json/step3_ioc_search(1)'))
Mock.mock(path.search.TagId, 'post', require('./json/step3_ioc_search(1)'))

Mock.mock(path.search.ttp, 'post', (req) => {
  console.log(req)
  return require('./json/apts_search')
})

Mock.mock(path.overview.apt, 'post', require('./json/report_findAll'))

Mock.mock(path.overview.statistics, 'post', require('./json/getStatistics'))

Mock.mock(path.overview.ip, 'post', ({ body }) => {
  // const { apt } = JSON.parse(body)
  const { data } = require('./json/ips_findAll')
  // const ret = []
  // data.forEach((item) => {
  //   if (item.apt === apt) {
  //     ret.push(item)
  //   }
  // })
  return {
    data: data,
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
  // const { apt } = JSON.parse(body)
  const { data } = require('./json/domains_findAll')
  // const ret = []
  // data.forEach((item) => {
  //   if (item.apt === apt) {
  //     ret.push(item)
  //   }
  // })
  return {
    data,
    code: 0
  }
})

Mock.mock(path.overview.email, 'post', ({ body }) => {
  const { data } = require('./json/emails_findAll')
  // const ret = []
  // data.forEach((item) => {
  //   if (item.apt === apt) {
  //     ret.push(item)
  //   }
  // })
  return {
    data,
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

Mock.mock(path.threadInfo.rank, 'post', ({ body }) => {
  console.log(body)
  return require('./json/report_countRankBySource')
})

Mock.mock(path.threadInfo.counts, 'post', ({ body }) => {
  console.log(body)
  return require('./json/report_countRankByCountry')
})

Mock.mock(path.threadInfo.apt, 'post', ({ body }) => {
  console.log(body)
  return require('./json/report_countRankByAPT')
})
