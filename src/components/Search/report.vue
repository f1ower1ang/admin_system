<template>
<div class="report">
  <div class="list" v-infinite-scroll="load">
    <result-card v-for="(item, index) in result" :item="item" :key="index" @select="goTo" locate="false"></result-card>
  </div>
</div>
</template>

<script>
import { searchReport } from '../../api/search'
import ResultCard from '../../components/Search/result-card'

export default {
  name: 'report',
  components: { ResultCard },
  props: {
    keywords: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      result: [],
      limit: 6,
      page: 1,
      total: 0
    }
  },
  watch: {
    keywords() {
      this.page = 1
      this.result = []
      this.getReport()
    },
    page(newPage, oldPage) {
      if (newPage <= oldPage) {
        return
      }
      if (this.result.length < this.total) {
        this.getReport()
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
      searchReport(this.keywords, this.limit, this.page).then(res => {
        this.total = res.count
        this.result = this.result.concat(res.data.map((item) => {
          return {
            title: `<h1>${item.description}</h1>${item.title}`,
            imgUrl: item.imgUrl,
            description: item.statement,
            url: item.fileUrl
          }
        }))
      })
    },
    goTo(item) {
      open(location.origin + item.url)
    }
  }
}
</script>

<style scoped lang="stylus">
  .report
    width 100%
    height 100%
    overflow hidden
    position relative
    .list
      position absolute
      top 20px
      bottom 0
      width 100%
      overflow-y auto
      overflow-x hidden
</style>
