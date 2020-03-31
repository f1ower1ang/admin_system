<template>
  <div class="ttp-report">
    <div class="search-type">
      <span :class="{active: radio === 1}" @click="changeLabel(1)">TTP详情关联</span>
      <span :class="{active: radio === 2}" @click="changeLabel(2)">TTP矩阵关联</span>
    </div>
    <div class="search-wrapper">
      <search-box :default="keywords" :placeholder="placeholder" @search="search" @change="change" />
    </div>
    <div class="result">
      <ul style="position:absolute; top: 0; bottom: 0; overflow-y: auto; overflow-x: hidden; padding-right: 20px" v-infinite-scroll="load">
        <li class="item" v-for="(card, index) in result" :key="index" @click="goTo(card)">
          <el-image :src="card.imgUrl" style="height: 100%; width: 170px;" />
          <div class="content">
            <div class="top">
              <div class="title">
                <h2>{{ card.title }}</h2>
                <span>别名：{{ card.synonym }}</span>
                <el-image v-for="(flag, index) in card.flags" style="width:28px; height:16px; margin-left: 10px; border-radius: 2px; overflow: hidden" :key="index" :src="flag">
                  <div slot="error">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </div>
              <p class="description">
                {{ card.description }}
              </p>
            </div>
            <div class="bottom">
              <p v-if="card.technique">技术：{{ card.technique }}</p>
              <p v-if="card.procedure">过程：{{ card.procedure }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <ttp-selector @search="searchByCon" ref="selector" />
  </div>
</template>

<script>
import SearchBox from '../../components/common/search-box'
import TtpSelector from '../../components/Search/TtpSelector'
import { searchTtp } from '../../api/search'

export default {
  name: 'TtpResult',
  components: { SearchBox, TtpSelector },
  data () {
    return {
      placeholder: '请输入APT名称、别名或过程',
      keywords: '',
      result: [],
      radio: 1,
      techniques: [],
      limit: 7,
      page: 1,
      total: 0
    }
  },
  watch: {
    page(newPage, oldPage) {
      if (newPage <= oldPage) {
        return
      }
      if (this.result.length < this.total) {
        this.getTtp()
      }
    }
  },
  created () {
    const { keywords, techniques } = this.$route.params
    if (keywords !== undefined) {
      if (techniques.length > 0) {
        this.radio = 2
        this.techniques = techniques
      }
      this.search(keywords)
    }
  },
  methods: {
    search (k) {
      this.keywords = k
      this.init()
    },
    change(k) {
      this.keywords = k
    },
    load() {
      if (this.page * this.limit < this.total) {
        this.page += 1
      }
    },
    getTtp() {
      if (this.radio === 1) {
        searchTtp(this.keywords, this.page, this.limit, []).then(res => {
          this.total = res.count
          this.result = this.result.concat(res.data.map((item) => {
            return {
              title: item.name,
              imgUrl: item.logo,
              flags: item.initiatorFlag.split(';'),
              description: item.summary,
              synonym: item.synonym,
              procedure: item.procedureName,
              technique: item.technique
            }
          }))
        })
      } else {
        searchTtp('', this.page, this.limit, this.techniques).then(res => {
          this.total = res.count
          this.result = this.result.concat(res.data.map((item) => {
            return {
              title: item.name,
              imgUrl: item.logo,
              flags: item.initiatorFlag.split(';'),
              description: item.summary,
              synonym: item.synonym,
              procedure: item.procedureName,
              technique: item.technique
            }
          }))
        })
      }
    },
    searchByCon(result) {
      this.techniques = []
      this.$refs.selector.hidden()
      Object.keys(result).forEach((k) => {
        this.techniques = this.techniques.concat(result[k])
      })
      this.init()
    },
    init() {
      this.total = 0
      this.result = []
      this.page = 1
      this.getTtp()
    },
    changeLabel(radio) {
      this.radio = radio
      if (radio === 2) {
        this.$refs.selector.show()
      }
    },
    goTo(card) {
      this.$router.push('/detail/map?name=' + card.title)
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
    .result
      margin 20px 40px 10px 40px
      width calc(100% - 80px)
      height calc(100% - 120px)
      position relative
      .item
        border-top 1px solid #E6E6E6
        padding 10px 0
        width 100%
        height 140px
        font-size 13px
        color $color-text-l
        display flex
        cursor pointer
        .content
          margin-left 20px
          flex 1
          overflow hidden
          height 100%
          display flex
          justify-content space-between
          flex-direction column
          .top
            .title
              display flex
              align-items center
              h2
                font-size $font-size-medium-x
                color $color-theme
                margin-right 10px
            .description
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              height 38px
              padding-right 20px
</style>
