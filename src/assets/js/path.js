export default {
  home: {
    aptList: '/apts/findAll',
    category: '/apts/getAptsInitiators',
    country: '/apts/getCountrys'
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
      url: '/urls/getInfosFromUrl',
      hash: '/trees/getTreesBySource'
    },
    inspect: '/report/findOneByHash'
  },
  search: {
    report: '/report/search',
    ioc: '/ioc/search',
    iocClue: '/ioc/searchClue',
    iocRecord: '/iocSearchRecord/findAll',
    searchRecordEdit: '/iocSearchRecord/editOne',
    searchRecordDelete: '/iocSearchRecord/delOneByEntity',
    iocExpand: '/iocExpandRecord/findAll',
    iocExpandDelete: '/iocExpandRecord/delOneByEntity',
    searchID: '/iocSearchRecord/findOneByEntity',
    ttp: '/apts/search',
    ttpSelector: '/techniques/getTechTable',
    iocRelationTag: '/iocRelationTag/addOne',
    TagId: '/iocRelationTag/findOneByEntity',
    EditTag: '/iocRelationTag/editOne',
    DeleteTag: '/iocRelationTag/delOneByEntity',
    Back: '/xxx'
  },
  user: {
    login: '/user/login',
    current: '/user/getCurrentUser',
    logout: '/user/logout_json',
    editUser: '/user/editOne'
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
  },
  threadInfo: {
    rank: '/report/countRankBySource',
    counts: '/report/countRankByCountry',
    apt: '/report/countRankByAPT'
  }
}
