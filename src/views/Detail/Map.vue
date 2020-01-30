<template>
  <div class="detail-wrapper">
    <tab :tabs="tabs" @handleTab="handleClick" :idx="currentIndex"></tab>
    <div class="content">
      <world-map v-show="current === 'detail'" :country="country"></world-map>
      <chart v-show="current === 'detail'"></chart>
      <div v-show="current === 'detail'" class="statement">
        <div class="text" v-for="(item, index) in state" :key="index">
          <p class="left">
            {{ item.title }}:
          </p>
          <p class="right">
            {{ item.content }}
          </p>
        </div>
      </div>
      <router-view></router-view>
      <keep-alive>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import WorldMap from '../../components/Map/map/WordMap'
import tab from '../../components/common/tab'
import chart from '../../components/Map/map/chart'
import { getOverview } from '../../api/detail'

export default {
  name: 'Map',
  components: {
    tab,
    WorldMap,
    chart
  },
  data () {
    return {
      tabs: [
        {
          label: '基本情况',
          name: 'detail',
          router: `/detail?name=${this.$route.query.name}`
        }, {
          label: '动态行为特征',
          name: 'ttp',
          router: `/detail/ttp?name=${this.$route.query.name}`
        }, {
          label: '静态资源特征',
          name: 'ioc',
          router: `/detail/ioc?name=${this.$route.query.name}`
        }],
      current: this.$route.name,
      currentIndex: 0,
      state: [],
      country: {}
    }
  },
  created () {
    this.current = this.$route.name
    this.getIndex()
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
  },
  methods: {
    handleClick (name) {
      this.current = name
    },
    getIndex () {
      this.currentIndex = this.tabs.findIndex((item) => item.name === this.current)
    }
  }
}
</script>

<style scoped lang="stylus">
  .detail-wrapper
    width 100%
    height 100%
    position relative

    .content
      width 100%
      position absolute
      top 55px
      bottom 0

      .statement
        position absolute
        top calc(200% - 140px)
        padding-bottom 20px

        .text
          margin-top 5px

          p
            line-height 30px
            display inline-block

          .left
            width 150px

      .opacity
        opacity 1
        z-index 10
</style>
