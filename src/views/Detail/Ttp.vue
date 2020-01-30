<template>
  <div class="ttp-wrapper">
    <tab :tabs="tabs" @handleTab="handleClick"></tab>
    <div class="content">
      <float-chart :class="{opacity: current === 'strategy'}"></float-chart>
      <technology :class="{opacity: current === 'technology'}" :technique-data="techniqueData"
                  :years="years"></technology>
      <process :class="{opacity: current === 'process'}" :process-data="processData" :years="years"></process>
    </div>
  </div>
</template>

<script>
import tab from '../../components/common/tab'
import technology from '../../components/Map/Ttp/technology'
import FloatChart from '../../components/Map/Ttp/flow-chart'
import process from '../../components/Map/Ttp/process'
import { getDefaultTtp } from '../../api/detail'

export default {
  name: 'Ttp',
  components: { tab, FloatChart, technology, process },
  data () {
    return {
      tabs: [{
        name: 'strategy',
        label: '战术环节图谱'
      }, {
        name: 'technology',
        label: '技术能力图谱'
      }, {
        name: 'process',
        label: '过程细节图谱'
      }],
      current: 'strategy',
      techniqueData: null,
      years: null,
      processData: null
    }
  },
  created () {
    this.current = 'strategy'
    this.years = []
    getDefaultTtp(this.$route.query.name).then((res) => {
      const { techniqueData, maxYear, minYear } = this.getTechniqueDataAndYear(res.data)
      this.processData = res.data
      this.techniqueData = techniqueData
      for (let i = minYear; i <= maxYear; i++) {
        this.years.push(i)
      }
    })
  },
  methods: {
    handleClick (name) {
      this.current = name
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
        techniqueData: data,
        maxYear,
        minYear
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  .ttp-wrapper
    height 100%
    display flex
    flex-direction column

    .content
      flex 1
      width 100%
      position relative
      overflow hidden

      .opacity
        opacity 1
        z-index 10
</style>
