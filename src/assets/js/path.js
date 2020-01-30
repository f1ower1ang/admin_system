export default {
  home: {
    aptList: '/apts/findAll',
    category: '/apts/getAptsInitiators'
  },
  detail: {
    overview: '/apts/findOneByName',
    charts: '/report/findAll',
    ttp: {
      default: '/procedures/getChartsByAPT',
      strategy: '/tactics/findAll',
      technique: '/procedures/getChartsByAPT',
      process: '/procedures/getChartsByAPT'
    },
    ioc: {
      default: '/trees/getTrees',
      domain: '/domains/getInfosFromDomain',
      email: '/emails/getInfosFromEmail',
      ip: '/ips/getInfosFromIp',
      sample: '/samples/getInfosFromSample',
      url: '/urls/getInfosFromUrl'
    }
  },
  search: {
    report: '/report/search',
    ioc: '/ioc/search',
    ttp: '/apts/search',
    ttpSelector: '/techniques/getTechTable'
  },
  user: {
    login: '/user/login',
    current: '/user/getCurrentUser',
    logout: '/user/logout_json'
  },
  overview: {
    apt: '/report/findAll',
    map: '/apts/findAll',
    process: '/procedures/getChartsByAPT',
    statistics: '/getStatistics',
    ip: '/ips/findAll',
    domain: '/domains/findAll',
    cve: '/cves/findAll',
    fileName: '/fileNames/findAll',
    email: '/emails/findAll',
    filePath: '/filePaths/findAll',
    registry: '/registries/findAll',
    sample: '/samples/findAll',
    url: '/urls/findAll'
  },
  reportList: {
    default: '/report/findAll'
  }
}
