<template>
<div class="report">
  <div class="list" v-infinite-scroll="load">
    <result-card v-for="(item, index) in result" border :item="item" :key="index" @search="search" />
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
  created () {
    if (this.keywords.length > 0) {
      this.page = 1
      this.result = []
      this.getReport()
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
            fileName: item.title,
            statement: item.statement,
            title: item.description,
            imgUrl: item.logo,
            url: item.fileUrl,
            date: item.date,
            item: {
              flag: item.countryFlag,
              name: item.country
            },
            apt: item.apt,
            hash: item.hashId
          }
        }))
      })
    },
    goTo(item) {
      open(location.origin + item.url)
    },
    search(k) {
      this.$emit('search', k)
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
      padding-right 20px
      bottom 0
      width 100%
      overflow-y auto
      overflow-x hidden
</style>
