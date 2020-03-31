<template>
  <div class="search-report">
    <p>情报一键查</p>
    <div class="search-wrapper">
      <search-box @search="search" :placeholder="placeholder"/>
    </div>
  </div>
</template>

<script>
import searchBox from '../../components/common/search-box'

export default {
  name: 'Report',
  components: { searchBox },
  data () {
    return {
      placeholder: '请输入关键词'
    }
  },
  methods: {
    search (k) {
      if (k.length > 0) {
        this.$router.push({
          name: 'report-result',
          params: {
            keywords: k
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .search-report
    width 100%
    height 100%
    p
      margin-top 200px
      text-align center
      color $color-theme
      font-size $font-size-large-x
    .search-wrapper
      width 70%
      margin 20px auto
</style>
