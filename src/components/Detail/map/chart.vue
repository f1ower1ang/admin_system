<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
import { getCharts } from '../../../api/detail'

export default {
  name: 'chart',
  mounted () {
    this.mychart = this.$echarts.init(this.$refs.chart)
    this.mychart.on('click', (param) => {
      window.open(param.data[5])
    })
  },
  created() {
    getCharts(this.$route.query.name, 10000).then((res) => {
      const { data, yData, firms } = this.getData(res.data)

      const dataArr = []
      data.forEach((item) => {
        item.forEach((i) => {
          dataArr.push(i[1])
        })
      })
      dataArr.sort(this.randomArray)

      this.option.xAxis[0].data = yData
      this.option.legend.data = firms
      this.option.yAxis[0].data = dataArr

      const series = []
      for (let i = 0; i < data.length; i++) {
        series.push({
          name: firms[i],
          data: data[i],
          type: 'scatter',
          symbolSize: function (data) {
            return data[2] * 9
          },
          label: {
            normal: {
              formatter: function (param) {
                return param.data[2]
              },
              position: 'top'
            }
          },
          emphasis: {
            label: {
              show: true,
              formatter(param) {
                return param.data[4]
              },
              position: 'top'
            }
          },
          itemStyle:
            {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: 5,
                color: this.color[i]
              }
            }
        })
      }
      this.option.series = series
      this.mychart && this.mychart.setOption(this.option)
    })
  },
  data() {
    return {
      option: {
        title: {
          text: '披露强度'
        },
        legend: {
          right: 10
        },
        xAxis: [{
          name: '时间',
          type: 'category',
          axisTick: { show: false },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        }],
        yAxis: [
          {
            scale: true,
            axisLabel: {
              formatter: function () {
                return ''
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
            type: 'value',
            min: 0,
            max: 100
          }]
      },
      color: ['#c94a44', '#33a3dc', '#f99e1c', '#7eb138', '#ebb40f', '#fde404', '#e1c315', '#94a76f', '#9ea718', '#e0719c', '#975e6d']
    }
  },
  methods: {
    getData(line) {
      let data = []
      let years = []
      let firms = []

      let obj = {}
      for (let i = 0; i < line.length; i++) {
        if (!obj[line[i].source]) {
          obj[line[i].source] = []
        }
        obj[line[i].source].push({
          grade: line[i].sourceGrade.toString(),
          url: line[i].fileUrl,
          name: line[i].shortName,
          date: line[i].date.split('-').slice(0, 2).join('-')
        })
        years.push(line[i].date.split('-')[0])
      }

      Object.keys(obj).forEach((key) => {
        let temp = []
        obj[key].forEach((item) => {
          temp.push([item.date, Math.random() * 100, item.grade, key, item.name, item.url])
        })
        firms.push(key)
        data.push(temp)
      })

      let max = Math.max.apply(null, years)
      let min = Math.min.apply(null, years)
      let yData = []
      for (let i = min; i <= max; i++) {
        for (let j = 1; j <= 12; j++) {
          if (j < 10) {
            yData.push(`${i}-0${j}`)
          } else {
            yData.push(`${i}-${j}`)
          }
        }
      }

      return {
        data,
        yData,
        firms
      }
    },
    randomArray() {
      return Math.random() > 0.5 ? -1 : 1
    }
  }
}
</script>

<style scoped lang="stylus">
  .chart
    position absolute
    left 0
    top 100%
    height 550px
    width 100%
    text-align center
</style>
