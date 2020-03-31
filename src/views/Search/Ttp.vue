<template>
  <div class="ttp-report">
    <p>TTP关联</p>
    <div class="search-type">
      <span :class="{active: radio === 1}" @click="changeLabel(1)">TTP详情关联</span>
      <span :class="{active: radio === 2}" @click="changeLabel(2)">TTP矩阵关联</span>
    </div>
    <div class="search-wrapper">
      <search-box :placeholder="placeholder" @search="search" @change="change" />
    </div>
    <ttp-selector @search="searchByCon" ref="selector" />
  </div>
</template>

<script>
import SearchBox from '../../components/common/search-box'
import TtpSelector from '../../components/Search/TtpSelector'

export default {
  name: 'Ttp',
  components: { SearchBox, TtpSelector },
  data () {
    return {
      placeholder: '请输入APT名称、别名或过程',
      keywords: '',
      radio: 1,
      techniques: []
    }
  },
  methods: {
    search (keywords) {
      if (keywords.length > 0) {
        this.keywords = keywords
        this.$router.push({
          name: 'ttp-result',
          params: {
            keywords,
            techniques: this.radio === 1 ? [] : this.techniques
          }
        })
      }
    },
    change(keywords) {
      this.keywords = keywords
    },
    searchByCon(result) {
      this.techniques = []
      this.$refs.selector.hidden()
      Object.keys(result).forEach((k) => {
        this.techniques = this.techniques.concat(result[k])
      })
      this.$router.push({
        name: 'ttp-result',
        params: {
          keywords: this.keywords,
          techniques: this.techniques
        }
      })
    },
    changeLabel(radio) {
      this.radio = radio
      if (radio === 2) {
        this.$refs.selector.show()
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .ttp-report
    width 100%
    height 100%
    overflow hidden
    p
      margin-top 200px
      text-align center
      color $color-theme
      font-size $font-size-large-x
    .search-type
      line-height 30px
      height 30px
      width 70%
      margin 20px auto 0
      span
        cursor pointer
        display inline-block
        padding 0 10px
        height 100%
        font-size $font-size-medium
        color $color-text-l
      .active
        color #fff
        background $color-theme
    .search-wrapper
      width 70%
      margin 0 auto
</style>
