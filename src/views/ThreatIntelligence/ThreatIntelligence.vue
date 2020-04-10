<template>
  <div class="ThreatIntelligence">
    <el-row class="top">
      <el-col :span="12" class="background">
        <p class="_title">
          <span>最新报告</span>
          <router-link to="/reportList">查看更多</router-link>
        </p>
        <div class="wrapper">
          <scroll-list :list="apts" type="apt-name" @select="goTo"></scroll-list>
        </div>
      </el-col>
      <el-col class="background" :span="12">
        <p class="_title">
          <span>年度厂商发布报告数排名</span>
          <router-link to="/reportList">查看更多</router-link>
        </p>
        <div class="wrapper" ref="cmp"></div>
        <div class="timeWrapper">
          <timeline :years="years" @select="filterCmp" />
        </div>
      </el-col>
    </el-row>
    <el-row class="bottom">
      <el-col :span="12" class="background">
        <p class="_title">
          <span>年度活跃APT来源国排名</span>
          <router-link to="/reportList">查看更多</router-link>
        </p>
        <div class="wrapper" ref="report"></div>
        <div class="timeWrapper">
          <timeline :years="years" @select="filterReport" />
        </div>
      </el-col>
      <el-col :span="12" class="background">
        <p class="_title">
          <span>年度活跃APT组织排名</span>
          <router-link to="/reportList">查看更多</router-link>
        </p>
        <div class="wrapper" ref="apt"></div>
        <div class="timeWrapper">
          <timeline :years="years" @select="filterApt" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ScrollList from '../../components/common/scroll-list'
import timeline from '../../components/common/timeline'
// eslint-disable-next-line no-unused-vars,standard/object-curly-even-spacing
import { getApts } from '../../api/overview'
import { getCompanyRank, getCountryCount, getAptRank } from '../../api/thread-info'

export default {
  name: 'ThreatIntelligence',
  components: { ScrollList, timeline },
  data () {
    return {
      aptName: '',
      maps: [],
      apts: '',
      timer: null,
      years: [],
      cmpChart: null,
      reportChart: null,
      aptChart: null
    }
  },
  mounted () {
    this.cmpChart = this.$echarts.init(this.$refs.cmp)
    this.reportChart = this.$echarts.init(this.$refs.report)
    this.aptChart = this.$echarts.init(this.$refs.apt)
  },
  async created () {
    const year = new Date().getFullYear()
    for (let i = year - 4; i <= year; i++) {
      this.years.push(i)
    }

    const { data: aptData } = await getApts(1, 100)
    this.getCompanyReport([year - 4, year])
    this.getAptRank([year - 4, year])
    this.getCountryReport([year - 4, year])

    const aptName = []
    const shortName = []
    const date = []
    const apts = []
    aptData.forEach((item) => {
      aptName.push({
        name: item.apt
      })
      shortName.push({
        name: item.description,
        url: item.fileUrl
      })
      date.push({
        name: item.date
      })
    })
    apts.push(JSON.stringify(aptName))
    apts.push(JSON.stringify(shortName))
    apts.push(JSON.stringify(date))
    this.apts = JSON.stringify(apts)
  },
  methods: {
    filterCmp(timeRange) {
      this.getCompanyReport(timeRange)
    },
    filterApt(timeRange) {
      this.getAptRank(timeRange)
    },
    filterReport(timeRange) {
      this.getCountryReport(timeRange)
    },
    goTo (item) {
      if (item.url) {
        open(item.url)
      } else {
        this.$router.push(`/detail?name=${item.name}`)
      }
    },
    goToCountry(item, type) {
      // this.$router.push(`/${type}?country=${item}`)
      let routerMyCard = this.$router.resolve({ path: `/${type}?country=${item}` })
      window.open(routerMyCard.href, '_blank')
    },
    // 得到 报告排名 数据
    async getCompanyReport (timeRange) {
      const { data } = await getCompanyRank(10, 1, timeRange)
      const name = []
      const value = []
      for (let j = 0; j < data.length; j++) {
        name.push(data[j].source)
        value.push(data[j].count)
      }
      const colorList = [
        '#016fff', '#06c3d8', '#57a9e2', '#7347c4', '#7364e0',
        '#e9c5c1', '#dd767a', '#e16255', '#0fb5fd', '#015b7d'
      ]
      const option = {
        label: {
          normal: {

            // 在文本中，可以对部分文本采用 rich 中定义样式。
            // 这里需要在文本中使用标记符号：
            // `{styleName|text content text content}` 标记样式名。
            // 注意，换行仍是使用 '\n'。
            formatter: [
              '{a|这段文本采用样式a}',
              '{b|这段文本采用样式b}这段用默认样式{x|这段用样式x}'
            ].join('\n'),

            rich: {
              a: {
                color: 'red',
                lineHeight: 10
              },
              b: {
                height: 40
              },
              x: {
                fontSize: 18,
                fontFamily: 'Microsoft YaHei',
                borderColor: '#449933',
                borderRadius: 4
              }
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '1%',
          left: '-15%',
          right: '24%',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          show: false
        },
        yAxis: {
          type: 'category',
          show: false,
          inverse: true,
          data: name
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex]
                },
                label: {
                  show: true,
                  position: 'right',
                  formatter: '{b} {c}',
                  textStyle: {
                    fontSize: 10,
                    color: '#C3C3C4'
                  }
                }
              }
            },
            barWidth: 15,
            data: value
          }
        ]
      }
      this.cmpChart && this.cmpChart.setOption(option)
      let _this = this
      this.cmpChart.on('click', function (params) {
        if (params.componentType === 'series') {
          _this.goToCountry(params.name, 'reportList')
        }
      })
    },
    // 根据国家统计报告数的图表
    async getCountryReport(timeRange) {
      const { data } = await getCountryCount(10, 1, timeRange)

      const name = []
      const value = []
      const colorList = [
        '#016fff', '#06c3d8', '#57a9e2', '#7347c4', '#7364e0',
        '#e9c5c1', '#dd767a', '#e16255', '#0fb5fd', '#015b7d'
      ]
      data.forEach((item, i) => {
        name.push(data[i].country)
        value.push(data[i].count)
      })

      // 指定图表的配置项和数据
      let option = {
        // 工具箱
        tooltip: {
          trigger: 'axis'
        },
        // x轴
        xAxis: {
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#f2f2f3'
            },
            formatter: function (params) {
              var newParamsName = ''// 最终拼接成的字符串
              var paramsNameNumber = params.length// 实际标签的个数
              var provideNumber = 4// 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber)// 换行的话，需要显示几行，向上取整
              /**
               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
               */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ''// 表示每一次截取的字符串
                  var start = p * provideNumber// 开始截取的位置
                  var end = start + provideNumber// 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p === rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber)
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr// 最终拼成的字符串
                }
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params
              }
              // 将最终的字符串返回
              return newParamsName
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: name
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#757377',
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#f2f2f3'
            }
          }
        },
        // 数据
        series: [{
          name: '报告发布数',
          type: 'bar',
          barWidth: 40,
          label: {
            show: true,
            position: 'top',
            color: '#f2f2f3',
            fontSize: 12,
            distance: 2 // 距离
          },
          data: value,
          itemStyle: {
            normal: {
              barBorderRadius: 4,
              color: function(params) {
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      }
      this.reportChart && this.reportChart.setOption(option)
      let _this = this
      this.reportChart.on('click', function (params) {
        if (params.componentType === 'series') {
          _this.goToCountry(params.name, 'reportList')
        }
      })
    },
    async getAptRank(timeRange) {
      const { data } = await getAptRank(10, 1, timeRange)
      const name = []
      const value = []
      const colorList = [
        '#016fff', '#06c3d8', '#57a9e2', '#7347c4', '#7364e0',
        '#e9c5c1', '#dd767a', '#e16255', '#0fb5fd', '#015b7d'
      ]
      data.forEach((item, i) => {
        name.push(data[i].apt)
        value.push(data[i].count)
      })

      // 指定图表的配置项和数据
      let option = {
        // 工具箱
        tooltip: {
          trigger: 'axis'
        },
        // x轴
        xAxis: {
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#f2f2f3'
            },
            formatter: function (params) {
              var newParamsName = ''// 最终拼接成的字符串
              var paramsNameNumber = params.length// 实际标签的个数
              var provideNumber = 4// 每行能显示的字的个数
              var rowNumber = Math.ceil(paramsNameNumber / provideNumber)// 换行的话，需要显示几行，向上取整
              /**
               * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
               */
              // 条件等同于rowNumber>1
              if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                  var tempStr = ''// 表示每一次截取的字符串
                  var start = p * provideNumber// 开始截取的位置
                  var end = start + provideNumber// 结束截取的位置
                  // 此处特殊处理最后一行的索引值
                  if (p === rowNumber - 1) {
                    // 最后一次不换行
                    tempStr = params.substring(start, paramsNameNumber)
                  } else {
                    // 每一次拼接字符串并换行
                    tempStr = params.substring(start, end) + '\n'
                  }
                  newParamsName += tempStr// 最终拼成的字符串
                }
              } else {
                // 将旧标签的值赋给新标签
                newParamsName = params
              }
              // 将最终的字符串返回
              return newParamsName
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: name
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#757377',
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#f2f2f3'
            }
          }
        },
        // 数据
        series: [{
          name: '报告发布数',
          type: 'bar',
          barWidth: 40,
          label: {
            show: true,
            position: 'top',
            color: '#f2f2f3',
            fontSize: 12,
            distance: 2 // 距离
          },
          data: value,
          itemStyle: {
            normal: {
              barBorderRadius: 4,
              color: function(params) {
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      }
      this.aptChart && this.aptChart.setOption(option)
      let _this = this
      this.aptChart.on('click', function (params) {
        if (params.componentType === 'series') {
          _this.goToCountry(params.name, 'reportList')
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "ThreatIntelligence.styl"
</style>
