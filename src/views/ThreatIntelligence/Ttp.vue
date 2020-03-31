<template>
<div class="inspect-ttp">
  <p class="header">
    报告TTP：{{ title }}
  </p>
  <div class="content">
    <div class="wrapper">
      <technology query-type="hash" :technique-data="techniqueData" :years="years" />
    </div>
  </div>
</div>
</template>

<script>
import technology from '../../components/Detail/Ttp/technology'
import { getTtpTechByHash, getInspectName } from '../../api/detail'
export default {
  name: 'InspectTtp',
  components: { technology },
  data() {
    return {
      techniqueData: null,
      years: [],
      title: ''
    }
  },
  async created () {
    const res = await getInspectName(this.$route.query.hash)
    this.title = res.data.description
    const { data } = await getTtpTechByHash(this.$route.query.hash)

    const { maxYear, minYear } = this.getTechniqueDataAndYear(data)
    this.techniqueData = data
    this.years = []
    for (let i = minYear; i <= maxYear; i++) {
      this.years.push(i)
    }
  },
  methods: {
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
</script>

<style scoped lang="stylus">
.inspect-ttp
  width 100%
  height 100%
  .header
    line-height 60px
    padding 0 20px
    background #fff
    width 100%
    height 60px
  .content
    width 100%
    height calc(100% - 60px)
    padding-top 20px
    background $color-background
    .wrapper
      width calc(100% - 40px)
      margin 0 auto
      height 100%
      position relative
</style>
