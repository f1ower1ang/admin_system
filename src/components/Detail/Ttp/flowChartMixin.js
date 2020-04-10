import { getStrategyDetail, getDefaultTtp } from '../../../api/detail'
export default {
  data () {
    return {
      flag: false,
      strategies: [],
      wordArr: []
    }
  },
  async created () {
    this.strategies = []
    this.wordArr = []

    const { data: data1 } = await getStrategyDetail()
    for (const device of this.devices) {
      this.strategies.push(data1.filter((item) => {
        return item.terminalType.indexOf(device) > -1
      }).map((item) => {
        return {
          name: item.name,
          detail: item.detail
        }
      }))
      const res = await getDefaultTtp(this.$route.query.name, device)
      res.data.forEach((item) => {
        this.wordArr.push(item.name)
      })
    }
    this.changeData()
  },
  methods: {
    changeData () {
      let div = this.devices.length === 1 ? document.querySelectorAll('.PC .div') : document.querySelectorAll('.mobile .div')
      console.log(this.wordArr)
      this.wordArr.forEach((item) => {
        for (let i = 0; i < div.length; i++) {
          if (item.trim() === div[i].innerText.trim()) {
            div[i].style.opacity = '0.9'
          }
        }
      })
    }
  }
}
