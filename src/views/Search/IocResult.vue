<template>
  <div class="ioc-result">
    <div class="left">
      <div class="head">
        <div class="headLeft">
          <search-box :default="keywords" @search="search" :placeholder="placeholder"/>
        </div>
        <div class="headRight no-radius">
          <el-button @click="fullScreen" icon="el-icon-full-screen" type="primary" size="medium"/>
        </div>
      </div>
      <div class="result">
        <result :keywords="keywords"/>
      </div>
    </div>
    <div class="rightRecord">
      <rightRecord :keywords="keywords"/>
    </div>
  </div>
</template>

<script>
import result from '../../components/Search/ioc'
import SearchBox from '../../components/common/search-box'
import rightRecord from '../../components/common/rightRecord'
import fScreen from '../../main'
export default {
  name: 'IocResult',
  // eslint-disable-next-line vue/no-unused-components
  components: { result, SearchBox, rightRecord },
  data() {
    return {
      placeholder: 'IP、域名、URL、HASH(MD5/SHA1/SHA256)、邮箱、字符串',
      input: '',
      keywords: '',
      show: true
    }
  },
  watch: {
  },
  created () {
    const { keywords } = this.$route.params
    if (keywords) this.search(keywords)
  },
  methods: {
    search(k) {
      if (k.length > 0) {
        this.keywords = k
        this.show = false
      }
      this.status = 'search'
    },
    fullScreen() {
      fScreen.$emit('screen', 1)
    }
  }
}
</script>

<style scoped lang="stylus">
  .ioc-result
    width 100%
    height 100%
    .left
      width 80%
      height 100%
      float left
      .head
        width 80%
        height 36px
        line-height 36px
        margin 20px auto
        .headLeft
          float left
          width 80%
        .headRight
          float left
          margin-left 10px
      .result
        width 100%
        height calc(100% - 76px)
    .rightRecord
      width 20%
      height 100%
      border-left: 1px solid #EBEEF5
      float left
</style>
