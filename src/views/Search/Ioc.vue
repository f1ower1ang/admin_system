<template>
  <div class="ioc-search">
    <div class="head">
      <p>IOC关联</p>
      <search-box @search="search"/>
    </div>
    <p class="keywords">
      <span v-for="(key, index) in hots" :key="index" @click="search(key)">{{ key }}</span>
    </p>
    <!--<div class="box" title="关联记录">
      <div class="display">
    </div>
    </div>-->
    <div style="width: 100%; height: 360px">
     <SearchRecord :importShow="show" @iocKeywords="toshow"/>
    </div>
  </div>
</template>

<script>
import SearchBox from '../../components/common/search-box'
import SearchRecord from '../../components/common/SearchRecord'
import testScoll from '../../components/common/testScoll'
export default {
  name: 'Ioc',
  // eslint-disable-next-line vue/no-unused-components
  components: { testScoll, SearchBox, SearchRecord },
  data () {
    return {
      placeholder: 'IP、域名、URL、HASH(MD5/SHA1/SHA256)、邮箱、字符串',
      input: '',
      hots: [
        'tonholding.com',
        '95.211.172.143',
        'f1799d11b34685aa209171b0a4b89d06'
      ],
      keywords: '',
      show: true
    }
  },
  watch: {},
  methods: {
    search (k) {
      if (k.length > 0) {
        this.$router.push({
          name: 'ioc-result',
          params: {
            keywords: k
          }
        })
      }
    },
    toshow(msg) {
      this.search(msg)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .ioc-search
    width 70%
    margin 0 auto
    height 100%
    display flex
    flex-direction column

    .head
      p
        margin-top 20px
        text-align center
        color $color-theme
        font-size $font-size-large-x

    .keywords
      width calc(100% - 66px)
      text-align center
      line-height 30px
      font-size $font-size-medium
      color $color-theme

      span
        padding-right 10px
        cursor pointer

    .box
      position relative
      width 100%
      margin-top 20px
      height 380px
      border 1px solid $color-theme-d
      .display
        width 100%
        height 360px
        margin-top 20px
    .box::before
      content attr(title)
      position absolute
      left 10%
      transform translateX(-50%)
      -webkit-transform translate(-50%,-50%)
      padding 0 10px
      color $color-text-d
      font-size $font-size-medium
      font-weight bold
      background-color #fff
</style>
