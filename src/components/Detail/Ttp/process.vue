<template>
  <div class="process" :class="{opacity: pure}">
    <div id="picture" v-if="!pure">
      <div id="paint" ref="process" style="width: 100%; height: 800px; margin-top: 10px; margin-bottom: 10px"></div>
    </div>
    <div v-if="pure" ref="process" style="width: 100%; height: 100%"></div>
    <div class="choose" v-if="!pure">
      <timeline :years="years" @select="changeTime"></timeline>
    </div>
  </div>
</template>

<script>
import timeline from '../../common/timeline'
import { Loading } from 'element-ui'
import { getTtpPrs } from '../../../api/detail'

export default {
  name: 'process',
  components: { timeline },
  mounted () {
    setTimeout(() => {
      this.myChart = this.$echarts.init(this.$refs.process)
      this.option.series.data = this.data
      this.myChart.setOption(this.option)
      if (this.pure) {
        this.option.textStyle = {
          fontSize: 8
        }
        this.option.series.label.formatter = function (param) {
          let name = param.name
          if (name.length <= 4) {
            return name
          } else {
            name = name.slice(0, 4) + '...'
            return name
          }
        }
        this.myChart.setOption(this.option)
      }
    }, 20)
  },
  data () {
    return {
      option: {
        title: {
          textStyle: {
            fontSize: 14,
            align: 'center'
          },
          subtextStyle: {
            align: 'center'
          },
          sublink: 'https://worldcoffeeresearch.org/work/sensory-lexicon/'
        },
        series: {
          type: 'sunburst',
          highlightPolicy: 'ancestor',
          radius: [0, '95%'],
          sort: null,
          label: {
            rotate: 'radial',
            formatter: function (param) {
              let name = param.name
              if (name.length <= 7) {
                return name
              } else {
                name = name.slice(0, 7) + '...'
                return name
              }
            }
          },
          levels: [{}, {
            r0: '15%',
            r: '35%',
            itemStyle: {
              borderWidth: 2
            }
          }, {
            r0: '35%',
            r: '70%',
            label: {
              align: 'right'
            }
          }, {
            r0: '70%',
            r: '72%',
            label: {
              position: 'outside',
              padding: 3,
              silent: false
            },
            itemStyle: {
              borderWidth: 3
            }
          }]
        },
        tooltip: {
          trigger: 'item',
          position(point, params, dom, rect, size) {
            let obj = { top: point[1] }
            obj[['left', 'right'][+(point[0] < size.viewSize[0] / 2)]] = 5
            return obj
          },
          formatter(params) {
            const parents = params.treePathInfo[1].name
            const children = params.treePathInfo[2].name
            const sHtml = params.treePathInfo[3].name
            return '<div style="text-align: left;width:400px;white-space:normal; word-break:break-all;overflow:hidden;">' + '<span>' + '战术：' + '</span>' + parents + '<br>' + '技术：' + children + '<br>' + '<span>' + '详情：' + '</span>' + sHtml + '</div>'
          }
        }
      },
      timeRange: [-1, -1],
      myChart: null
    }
  },
  props: {
    years: {
      type: Array,
      default: null
    },
    processData: {
      type: Array,
      default: null
    },
    pure: {
      type: Boolean,
      default: false
    },
    device: {
      type: String,
      default: 'PC'
    }
  },
  watch: {
    processData: {
      handler(newData) {
        this.changeData(newData)
      },
      deep: true
    },
    years() {
      this.timeRange = [this.years[0], this.years[this.years.length - 1]]
    },
    timeRange: {
      handler(newTime) {
        if (newTime[0] <= newTime[1]) {
          if (this.timer) {
            clearTimeout(this.timer)
            this.endLoading()
          }
          this.startLoading()
          this.timer = setTimeout(() => {
            getTtpPrs(this.$route.query.name, this.timeRange[0], this.timeRange[1], this.device).then((res) => {
              this.changeData(res.data)
              this.endLoading()
            })
          }, 200)
        }
      },
      deep: true
    }
  },
  methods: {
    changeData(data) {
      this.option.series.data = this.formalize(data)
      if (!this.myChart) {
        this.myChart = this.$echarts.init(this.$refs.process)
      }
      this.option.animationEasing = 'elasticOut'
      this.option.animationDelayUpdate = function (idx) {
        return idx * 30
      }
      this.myChart.setOption(this.option)
    },
    changeTime(timeRange) {
      this.timeRange = timeRange
    },
    startLoading() {
      this.loading = Loading.service({
        lock: true,
        target: '#paint'
      })
    },
    endLoading() {
      this.loading && this.loading.close()
    },
    formalize(data) {
      if (!data) return
      let a = data
      let b = []// 第一层数据
      for (let i = 0; i < a.length; i++) {
        let line = a[i]
        b.push(
          {
            name: line.name,
            itemStyle: line.itemStyle,
            children: line.children
          }
        )
      }
      let c = []// 第二层数据
      for (let i = 0; i < a.length; i++) {
        let line = b[i]
        let Children = line.children
        let child = []
        for (let j = 0; j < Children.length; j++) {
          child.push({
            name: Children[j].name,
            itemStyle: Children[j].itemStyle,
            children: Children[j].children
          })
        }
        c.push({
          name: line.name,
          itemStyle: line.itemStyle,
          children: child
        })
      }
      let d = []// 第三层数据
      for (let i = 0; i < a.length; i++) {
        let line = c[i]
        let Children = line.children
        let Children1 = []
        for (let j = 0; j < Children.length; j++) {
          let child = Children[j].children
          let child1 = []
          child1.push({
            children: child.children,
            name: child[0].name,
            itemStyle: child[0].itemStyle,
            value: 1
          })
          Children1.push({
            name: Children[j].name,
            itemStyle: Children[j].itemStyle,
            children: child1
          })
        }
        d.push({
          name: line.name,
          itemStyle: line.itemStyle,
          children: Children1
        })
      }
      return d
    }
  }
}
</script>

<style scoped lang="stylus">
  .process
    position absolute
    left 0
    top 0
    width 100%
    height 100%

    #picture
      position absolute
      top 0
      left 0
      bottom 60px
      width 100%
      overflow-y auto
      overflow-x hidden

    .choose
      position absolute
      bottom 0
      height 60px
      margin-left 15%
      width 70%

      .time
        display flex

        p
          font-size 14px

        .timeline
          flex 1
  .opacity
    opacity 1
</style>
