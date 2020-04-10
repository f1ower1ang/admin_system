<template>
  <div class="search-report">
    <div class="search-wrapper">
      <search-box :default="keywords" @search="search" :placeholder="placeholder"/>
    </div>
    <div class="result">
      <result :keywords="keywords" @search="search"/>
    </div>
  </div>
</template>

<script>
import result from '../../components/Search/report'
import searchBox from '../../components/common/search-box'

export default {
  name: 'ReportResult',
  components: { result, searchBox },
  data () {
    return {
      placeholder: '请输入关键词',
      keywords: ''
    }
  },
  created () {
    const { keywords } = this.$route.params
    if (keywords) this.search(keywords)
  },
  methods: {
    search (k) {
      if (k.length > 0) {
        this.keywords = k
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .search-report
    width 100%
    padding 20px 40px
    margin 0 auto
    height 100%
    display flex
    flex-direction column
    .search-wrapper
      width 70%
      margin 0 auto
    .result
      margin-top 20px
      flex 1
</style>
