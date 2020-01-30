<template>
  <div class="ttp-report">
    <div class="search-box">
      <el-input v-model="input" :placeholder="placeholder"/>
      <el-button @click="search">搜索</el-button>
    </div>
    <p class="keywords">
      <span v-for="(key, index) in hots" :key="index" @click="search(key)">{{ key }}</span>
    </p>
    <div class="result">
      <result :keywords="keywords"/>
    </div>
  </div>
</template>

<script>
import result from '../../components/Search/ttp'

export default {
  name: 'Ttp',
  components: { result },
  data () {
    return {
      placeholder: '请输入APT名称、别名或过程',
      input: '',
      hots: [
        'tonholding.com',
        '95.211.172.143',
        'f1799d11b34685aa209171b0a4b89d06'
      ],
      keywords: ''
    }
  },
  methods: {
    search (k) {
      if (k.length > 0) {
        this.input = k
      }
      this.keywords = this.input
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .ttp-report
    width 70%
    margin 0 auto
    height 100%
    display flex
    flex-direction column
    .search-box
      display flex
      .el-input
        flex 1
      .el-button
        margin-left 10px
    .keywords
      line-height 30px
      font-size $font-size-small
      color $color-text-d
      span
        margin-right 10px
        cursor pointer
    .result
      flex 1
</style>
