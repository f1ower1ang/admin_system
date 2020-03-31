<template>
  <div class="map-wrapper">
    <world-map :country="country"></world-map>
    <chart></chart>
    <div class="statement">
      <div class="text" v-for="(item, index) in state" :key="index">
        <p class="left">
          {{ item.title }}
        </p>
        <p class="right">
          {{ item.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import WorldMap from '../../components/Detail/map/WordMap'
import chart from '../../components/Detail/map/chart'
import { getOverview } from '../../api/detail'

export default {
  name: 'DetailMap',
  components: {
    WorldMap,
    chart
  },
  data () {
    return {
      state: [],
      country: {}
    }
  },
  created () {
    getOverview(this.$route.query.name).then((res) => {
      this.country = {
        0: res.data.initiatorEnName.trim().length > 0 ? res.data.initiatorEnName.split(';').map((val) => {
          return {
            name: val.trim()
          }
        }) : null,
        1: res.data.targetEnName.trim().length > 0 ? res.data.targetEnName.split(';').map((val) => {
          return {
            name: val.trim()
          }
        }) : null
      }
      this.state = [
        {
          title: 'APT名称',
          content: res.data.name
        }, {
          title: 'APT别名',
          content: res.data.synonym
        }, {
          title: '攻击发起者',
          content: res.data.initiator
        }, {
          title: '疑似的支持者',
          content: res.data.sponsor
        }, {
          title: '攻击目标',
          content: res.data.target
        }, {
          title: '攻击行业',
          content: res.data.industry
        }, {
          title: 'APT的类型',
          content: res.data.type
        }, {
          title: '疑似最早活跃时间',
          content: res.data.date
        }, {
          title: '概况',
          content: res.data.summary
        }]
    })
  }
}
</script>

<style scoped lang="stylus">
  .map-wrapper
    width calc(100% - 40px)
    height 100%
    position relative
    margin 20px 20px 0 20px

    .statement
      position absolute
      top calc(100% + 550px)
      padding-bottom 20px

      .text
        margin-top 5px
        display flex

        p
          font-size $font-size-medium
          line-height 30px
          display inline-block

        .left
          width 150px
          color $color-text-l
          flex-shrink 0

    .opacity
      opacity 1
      z-index 10
</style>
