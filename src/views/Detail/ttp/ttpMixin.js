import { getDefaultTtp } from '../../../api/detail'

export default {
  data () {
    return {
      devices: ['PC'],
      dataList: {
        data: null,
        years: []
      },
      device: 'PC'
    }
  },
  async created () {
    await this.getDataList()
  },
  methods: {
    async changeDevice (device) {
      this.device = device
      this.dataList.years = []
      await this.getDataList()
    },
    async getDataList () {
      const { data } = await getDefaultTtp(this.$route.query.name, this.device)
      if (data.length === 0) {
        this.dataList.years = []
      } else {
        const { maxYear, minYear } = this.getTechniqueDataAndYear(data)
        for (let i = minYear; i <= maxYear && i !== 0; i++) {
          this.dataList.years.push(i)
        }
      }
      this.dataList.data = data
    },
    getTechniqueDataAndYear (data) {
      let years = []
      let maxYear = 0
      let minYear = 0
      data.forEach((item) => {
        if (item.date.length > 0) {
          years.push(item.date.split('-')[0])
        }
        item.children.forEach((child) => {
          if (child.date.length > 0) {
            years.push(child.date.split('-')[0])
          }
          if (child.children) {
            child.children.forEach((c) => {
              if (c.date.length > 0) {
                years.push(c.date.split('-')[0])
              }
            })
          }
        })
      })
      years = Array.from(new Set(years))

      maxYear = Math.max.apply(null, years)
      minYear = Math.min.apply(null, years)
      return {
        maxYear,
        minYear
      }
    }
  }
}
