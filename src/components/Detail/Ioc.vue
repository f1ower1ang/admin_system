<template>
  <div class="ioc-wrapper">
    <div class="ioc" ref="ioc"></div>
    <el-button @click="goTo" type="primary" size="mini" style="position:absolute; top: 0; right: 40px; color: #fff" icon="el-icon-upload2">
      导出
    </el-button>
    <transition name="fade" class="tooltip-wrapper">
      <div ref="tooltip" class="tooltip-wrapper" v-show="flag" @mouseenter="show">
        <i class="fa fa-close" @click="hidden"/>
        <div class="tooltip" v-html="dom"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getIocDomain, getIocIp, getIocSample, getIocEmail, getIocUrl } from '../../api/detail'

export default {
  data() {
    return {
      option: {
        series: [
          {
            type: 'tree',
            left: '10%',
            right: '35%',
            top: '0',
            bottom: '0',
            symbolSize: 7,
            label: {
              normal: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 12
              }
            },

            leaves: {
              label: {
                normal: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              }
            },
            expandAndCollapse: true,
            roam: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      },
      dir: null,
      children: [],
      dom: '暂无结果',
      flag: false
    }
  },
  props: {
    iocData: {
      type: Object,
      default: null
    }
  },
  computed: {
    url() {
      let base = '/trees'
      for (let key in this.$route.query) {
        if (key === 'hash') base += `/excelExportBySource?name=${this.$route.query[key]}`
        else if (key === 'name') base += `/excelExport?name=${this.$route.query[key]}`
      }
      return base
    }
  },
  watch: {
    iocData: {
      handler() {
        if (this.myChart) {
          this.handleIocData()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.myChart = this.$echarts.init(this.$refs.ioc)
    if (this.iocData) {
      this.handleIocData()
    }
    let that = this
    this.myChart.on('click', that.handleTooltip)
  },
  methods: {
    async getDetail (type, query) {
      let dom = ''
      if (type === '邮箱') {
        const { data } = await getIocEmail(query)
        if (data.relatedDomains.length > 0) {
          dom += `<p>邮箱关联域名：<br />${data.relatedDomains}</p>`
        }
      } else if (type === '域名') {
        const { data } = await getIocDomain(query)
        let ipDom = ''
        if (data.ipList.length > 0) {
          data.ipList.forEach((ip) => {
            ipDom += `<p>IP: ${ip.lastResolvedIpAddress}<br />最后解析时间：${ip.lastResolvedTime}</p>`
          })
        }
        let subDom = ''
        if (data.subDomainList.length > 0) {
          data.subDomainList.forEach((domain) => {
            subDom += `<p>子域名: ${domain.subdomains}</p>`
          })
        }
        let infoDom = ''
        if (data.infoList.length > 0) {
          data.infoList.forEach((info) => {
            infoDom += `<p>CDN解析记录：<br />${info.cloudflare}</p><p>DNS解析记录：<br><pre>${JSON.stringify(info.dnsDomainIp, null, 2)}</pre></p><p>邮箱解析记录：<br><pre>${JSON.stringify(info.mxDomainIp, null, 2)}</pre></p>`
          })
        }
        let whoDom = ''
        if (data.whoisList.length > 0) {
          data.whoisList.forEach((whois) => {
            whoDom += `<p><pre>${JSON.stringify(whois.whoisDict, null, 2)}</pre></p>`
          })
        }
        if (ipDom || subDom || infoDom || whoDom) {
          dom += `<div><h1>IP:</h1> ${ipDom}</div>
                <div><h1>子域名：</h1>${subDom}</div>
                <div><h1>信息：</h1>${infoDom}</div>
                <div><h1>WHOIS：</h1>${whoDom}</div>`
        }
      } else if (type === '网址') {
        const { data } = await getIocUrl(query)
        if (data.infoList && data.infoList.length > 0) {
          data.infoList.forEach((info) => {
            dom += `<p>vtInfo: <br><pre>${JSON.stringify(info.vtInfo, null, 2)}</pre></p>`
          })
        }
      } else if (type === '样本') {
        const { data } = await getIocSample(query)
        if (data.infoList && data.infoList.length > 0) {
          data.infoList.forEach((info) => {
            dom += `<p>vtInfo: <br><pre>${JSON.stringify(info.vtInfo, null, 2)}</pre></p>`
          })
        }
      } else if (type === 'ip地址') {
        const { data } = await getIocIp(query)
        if (data.infoList && data.infoList.length > 0) {
          data.infoList.forEach((info) => {
            dom += `<p>shodan信息：<br><pre>${JSON.stringify(info.shodanInfo, null, 2)}</pre></p><p>ipwhois信息：<br><pre>${JSON.stringify(info.ipwhoisInfo, null, 2)}</pre></p>`
          })
        }
      }
      this.dom = dom.length > 0 ? dom : '暂无结果'
    },
    async handleTooltip (params) {
      const types = ['网址', 'ip地址', '域名', '邮箱', '样本']
      if (params && params.name) {
        let query = params.name
        let tooltip = this.$refs.tooltip
        const { pageX, pageY } = params.event.event
        tooltip.style.right = `${document.body.clientWidth - pageX}px`
        if (pageY * 2 > document.body.clientHeight) {
          tooltip.style.top = ''
          if (pageY < 630) {
            tooltip.style.bottom = `${document.body.clientHeight - 630}px`
          } else {
            tooltip.style.bottom = `${document.body.clientHeight - pageY}px`
          }
        } else {
          tooltip.style.bottom = ''
          if (pageY + 500 >= document.body.clientHeight - 130) {
            tooltip.style.top = `${document.body.clientHeight - 130 - 500}px`
          } else {
            tooltip.style.top = `${pageY}px`
          }
        }
        for (let k in this.children) {
          if (types.indexOf(k) > -1 && this.children[k].indexOf(query) > -1) {
            await this.getDetail(k, query)
            this.show()
            this.hiddenTimer = setTimeout(this.hidden, 2000)
          }
        }
      }
    },
    show () {
      if (this.hiddenTimer) {
        clearTimeout(this.hiddenTimer)
      }
      this.flag = true
    },
    hidden () {
      this.hiddenTimer = setTimeout(() => {
        this.flag = false
      }, 200)
    },
    handleIocData() {
      this.dir = this.iocData
      this.dir.children.forEach((item) => {
        this.children[item.name] = []
        this.children[item.name].push(...item.children.map(s => s.name))
      })
      this.option.series[0].data = [this.dir]
      this.myChart && this.myChart.setOption(this.option)
    },
    goTo() {
      open(this.url)
    }
  }
}
</script>

<style scoped lang="stylus">
  .ioc-wrapper
    width 100%
    height 100%
    position relative
    margin-top 20px

    .ioc
      width 100%
      height 800%
      text-align center
      padding-bottom 20px

    .tooltip-wrapper
      position fixed
      background rgba(0, 0, 0, .5)
      color #fff
      padding 10px
      .tooltip
        width 600px
        height 500px
        overflow scroll
        white-space normal
        word-break break-all
        clear both
      .fa
        margin-top -5px
        margin-bottom 5px
        margin-right -5px
        float right
        width 25px
        height 25px
        line-height 25px
        border-radius 50%
        background #888
        text-align center
        cursor pointer

      &.fade-enter-active, &.fade-leave-active
        transition all .4s

      &.fade-enter, &.fade-leave-to
        opacity 0

      p
        font-size 12px
</style>
