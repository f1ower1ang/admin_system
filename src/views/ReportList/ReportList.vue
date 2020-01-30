<template>
  <div class="report-list">
    <p class="title">
      报告总条数：{{ total }}
    </p>
    <div class="list" v-infinite-scroll="load">
      <result-card v-for="(item, index) in list" :item="item" :key="index" @select="goTo" locate="false"></result-card>
    </div>
  </div>
</template>

<script>
import ResultCard from '../../components/Search/result-card'
import { getReportList } from '../../api/report-list'

export default {
  name: 'ReportList',
  components: { ResultCard },
  data() {
    return {
      page: 1,
      limit: 5,
      total: 0,
      list: []
    }
  },
  created() {
    this.getReport()
  },
  watch: {
    page(newPage, oldPage) {
      if (newPage <= oldPage) {
        return
      }
      this.getReport()
      if (this.list.length < this.total) {
      }
    }
  },
  methods: {
    load() {
      if ((this.page) * this.limit < this.total) {
        this.page += 1
      }
    },
    getReport() {
      getReportList(this.page, this.limit).then((res) => {
        this.list = this.list.concat(res.data.map((item) => {
          return {
            description: item.name,
            title: item.description,
            imgUrl: '',
            url: item.fileUrl,
            date: item.date
          }
        }))
        this.total = res.count
      })
    },
    goTo(item) {
      open(location.origin + item.url)
    }
  }
}
</script>

<style scoped lang="stylus">
  .report-list
    width 100%
    height 100%
    position relative
    overflow hidden
    .title
      padding 0 20px
      lien-height 30px
      font-size 18px
      font-weight bold
    .list
      position absolute
      top 30px
      bottom 0
      left 0
      width 100%
      overflow-y auto
      overflow-x hidden
      padding 0 20px
</style>
