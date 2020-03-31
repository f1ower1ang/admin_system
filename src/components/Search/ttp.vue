<template>
<div class="ttp">
  <div class="sort">
    <el-radio v-model="radio" label="1" border>根据APT名称</el-radio>
    <el-radio v-model="radio" label="2" @click.native="showSelector" border>根据TTP筛选</el-radio>
  </div>
  <ttp-selector @search="searchByCon" ref="selector"></ttp-selector>
  <div class="list">
    <div style="position:absolute; top: 0; bottom: 0; overflow-y: auto; overflow-x: hidden" v-infinite-scroll="load">
      <result-card v-for="(item, index) in result" :item="item" :key="index"></result-card>
    </div>
  </div>
</div>
</template>

<script>
import { searchTtp } from '../../api/search'
import TtpSelector from './TtpSelector'

export default {
  name: 'ttp',
  components: { ResultCard, TtpSelector },
  props: {
    keywords: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      result: [],
      radio: '1',
      techniques: [],
      limit: 7,
      page: 1,
      total: 0
    }
  },
  methods: {
    load() {
      if (this.page * this.limit < this.total) {
        this.page += 1
      }
    },
    searchByCon(result) {
      this.$emit('search')
      this.techniques = []
      this.$refs.selector.hidden()
      Object.keys(result).forEach((k) => {
        this.techniques = this.techniques.concat(result[k])
      })
      this.init()
    },
    showSelector() {
      this.$refs.selector.show()
    },
    getTtp() {
      if (this.radio === '1') {
        searchTtp(this.keywords, this.page, this.limit, []).then(res => {
          this.total = res.count
          this.result = this.result.concat(res.data.map((item) => {
            return {
              title: item.name,
              imgUrl: '',
              logo: item.initiatorFlag.split(';'),
              name: item.name,
              description: item.summary,
              query: [{
                key: 'APT别名',
                value: item.synonym
              }, {
                key: '过程细节',
                value: item.procedureName
              }]
            }
          }))
        })
      } else {
        searchTtp(this.keywords, this.page, this.limit, this.techniques).then(res => {
          this.total = res.count
          this.result = this.result.concat(res.data.map((item) => {
            return {
              title: item.name,
              imgUrl: '',
              logo: item.initiatorFlag.split(';'),
              name: item.name,
              description: item.summary,
              query: [{
                key: '命中',
                value: item.technique
              }]
            }
          }))
        })
      }
    },
    init() {
      this.total = 0
      this.result = []
      this.page = 1
      this.getTtp()
    }
  },
  watch: {
    keywords() {
      this.init()
    },
    page(newPage, oldPage) {
      if (newPage <= oldPage) {
        return
      }
      if (this.result.length < this.total) {
        this.getTtp()
      }
    },
    radio: {
      handler(now) {
        this.$emit('changeLabel', now)
      },
      deep: true
    }
  }
}
</script>

<style lang="stylus">
  @import "../../assets/stylus/variable.styl"
  .ttp
    height 100%
    width 100%
    overflow hidden
    .sort
      margin-top 10px
      .is-checked
        border-color $color-theme
        color $color-theme
        .el-radio__inner
          border-color $color-theme
          color $color-theme
          background $color-theme
        &+.el-radio__label
          color $color-theme
    .list
      width 100%
      margin-top 10px
      overflow hidden
      position relative
      height calc(100% - 50px)
</style>
