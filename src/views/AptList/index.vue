<template>
  <div class="home">
    <div class="search-wrapper">
      <search-box @search="search"/>
    </div>
    <div class="selector" ref="selector">
      <flag :item="item" :active="radio === item.name" @click.native="changeRadio(item, index)"
            v-for="(item, index) in curSelectors" :key="index" ref="flags"/>
      <flag :item="more" v-if="selectors.length > count" @click.native="changeCountry" style="margin-right: 0;"/>
    </div>
    <div class="option">
      <p class="btn" :class="{active: type === 'list'}" @click="changeType('list')">
        <i class="el-icon-notebook-2"/>列表
      </p>
      <p class="btn" :class="{active: type === 'matrix'}" @click="changeType('matrix')">
        <i class="el-icon-s-grid"/>阵列
      </p>
    </div>
    <div style="padding: 10px 20px" id="card">
      <pagination v-show="type === 'list'" :page="listPage" :page-size="listSize" :total="listTotal"
                  @updateData="splitCards">
        <el-table :data="listCards" border
                  :header-cell-style="{background:'rgba(241,243,247,1)',color:'#233A51', textAlign: 'center'}"
                  @row-click="goTo"
        >
          <el-table-column v-for="(header, index) in headers" :key="index" :label="header">
            <template slot-scope="scope">
              <p class="item" :title="scope.row[header]">{{ scope.row[header] }}</p>
            </template>
          </el-table-column>
        </el-table>
      </pagination>
      <pagination v-show="type === 'matrix'" :page="matrixPage" :page-size="matrixSize" :total="matrixTotal"
                  @updateData="splitCards">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(card, index) in matrixCards" :key="index">
            <el-card :body-style="{padding: '15px'}" shadow="hover">
              <h1 class="title">
                {{ card.name }}
              </h1>
              <div class="content">
                {{ card.description }}
              </div>
              <div class="bottom">
                <div class="country" v-for="(flag, index) in card.flags" :key="index" :title="card.initiators[index]">
                  <el-image
                    style="font-size: 14px; width: 15px;height: 15px; line-height: 15px; border-radius: 50%; overflow: hidden; margin-right: 3px"
                    lazy :src="flag">
                    <div slot="error">
                      <i class="el-icon-picture-outline-round"/>
                    </div>
                  </el-image>
                  <span>{{card.initiators[index]}}</span>
                </div>
                <router-link :to="`/detail?name=${card.name}`" tag="p">
                  查看详情
                </router-link>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </pagination>
    </div>
  </div>
</template>

<script>
import Pagination from '../../components/common/pagination'
import flag from '../../components/common/flag'
import searchBox from '../../components/common/search-box'
import { Loading } from 'element-ui'
import { getCards, getCategory } from '../../api/home'
import { searchTtp } from '../../api/search'

export default {
  name: 'home',
  components: {
    Pagination,
    flag,
    searchBox
  },
  data () {
    return {
      keywords: '',
      status: 'default',
      listCards: [],
      matrixCards: [],
      matrixPage: 1,
      matrixSize: 8,
      matrixTotal: 0,
      listPage: 1,
      listSize: 10,
      listTotal: 0,
      loading: null,
      selectors: [{ name: '全部' }],
      more: {
        name: '更多'
      },
      curSelectors: [],
      radio: '全部',
      type: 'list',
      headers: ['组织名称', '组织别名', '发起者', '目标', '报告数'],
      count: 22
    }
  },
  created () {
    getCategory().then((res) => {
      this.selectors = this.selectors.concat(res.data.map((item) => {
        return {
          name: item.initiator,
          flag: item.initiatorFlag
        }
      }))
      this.curSelectors = this.selectors.slice(0, this.count - 1)
    })
  },
  mounted () {
    this.count = Math.floor((this.$refs.selector.offsetWidth - 20) / 100) * 2
    if (this.selectors.length > 0) {
      this.curSelectors = this.selectors.slice(0, this.count - 1)
    }
  },
  activated () {
    this.radio = this.$route.query.country ? this.$route.query.country : ''
    this.getAndFormalCards(1)
  },
  watch: {
    $route (to, from) {
      if (from.path === '/login') {
        location.reload()
      }
    },
    radio: {
      handler () {
        this.startLoading()
        setTimeout(() => {
          this.listPage = 1
          this.matrixPage = 1
          this.matrixCards = []
          this.listCards = []
          this.getAndFormalCards(1)
          this.endLoading()
        }, 200)
      },
      deep: true
    },
    type: {
      handler (cur) {
        if (this[cur + 'Cards'].length === 0) this.getAndFormalCards(1)
      },
      deep: true
    },
    status: {
      handler() {
        if (this.type === 'list') {
          this.matrixCards = []
          this.matrixPage = 1
        } else {
          this.listPage = 1
          this.listCards = []
        }
      },
      deep: true
    }
  },
  methods: {
    goTo(row) {
      this.$router.push('/detail?name=' + row['组织名称'])
    },
    changeType (t) {
      this.type = t
    },
    search (k) {
      this.status = 'search'
      this.keywords = k
      this.getAndFormalCards(1)
    },
    changeCountry () {
      if (this.more.name === '更多') {
        this.curSelectors = this.selectors.slice()
        this.more.name = '收起'
      } else {
        this.curSelectors = this.selectors.slice(0, this.count - 1)
        this.more.name = '更多'
      }
    },
    changeRadio (item) {
      this.status = 'default'
      this.radio = item.name
    },
    splitCards (val) {
      this.startLoading()
      setTimeout(() => {
        this.getAndFormalCards(val)
        this.endLoading()
      }, 200)
    },
    async getAndFormalCards (page) {
      this[this.type + 'Page'] = page
      let res = null
      if (this.radio === '全部') {
        res = this.status === 'search' ? await searchTtp(this.keywords, page, this[this.type + 'Size'], []) : await getCards(this[this.type + 'Size'], page, '')
      } else {
        res = this.status === 'search' ? await searchTtp(this.keywords, page, this[this.type + 'Size'], []) : await getCards(this[this.type + 'Size'], page, this.radio)
      }
      console.log(res)
      if (res.code === 0) {
        this[this.type + 'Cards'] = res.data.map((item) => {
          if (this.type === 'list') {
            return {
              '组织名称': item.name,
              '组织别名': item.synonym,
              '发起者': item.initiator,
              '目标': item.target,
              '报告数': item.reportCount
            }
          } else {
            return {
              name: item.name,
              flags: item.initiatorFlag.split(';'),
              initiators: item.initiator.split(';'),
              description: item.summary
            }
          }
        })
        this[this.type + 'Total'] = res.count
      }
    },
    startLoading () {
      this.loading = Loading.service({
        lock: true,
        target: '#card'
      })
    },
    endLoading () {
      this.loading && this.loading.close()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../../assets/stylus/mixin.styl"
  .home
    padding 20px 0

    .search-wrapper
      padding-top 10px
      width 70%
      margin 0 auto

    .selector
      margin-top 10px
      line-height 60px
      padding-left 20px
      width 100%
      display flex
      flex-wrap wrap
      align-items center

      .flag
        margin-right 10px
        margin-bottom 5px

    .option
      height 60px
      width 100%
      margin-top 10px
      padding 0 20px
      border-top 1px solid rgba(217, 217, 217, 0.5)
      display flex
      align-items center

      .btn
        padding 5px 12px
        margin-right: 10px;
        cursor pointer
        border-radius 2px
        font-size $font-size-medium

        i
          margin-right 3px

      .active
        background $color-theme
        color #fff
    .el-table
      .item
        text-align center
        color #233A51
        no-wrap()
    .el-card
      margin-bottom 20px

      .title
        font-size $font-size-large
        font-weight bold
        line-height 25px
        overflow hidden

      .content
        margin 20px 0
        font-size $font-size-medium
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4; /*显示几行*/
        overflow: hidden;
        height 85px

      .bottom
        display flex
        align-items center

        .country
          height 15px
          line-height 15px
          font-size $font-size-small
          color $color-text-l
          flex 1
          overflow hidden
          display flex
          align-items center

          span
            flex 1
            no-wrap()

        p
          line-height 15px
          color $color-theme
          font-size $font-size-medium
          cursor pointer
          transition all .2s
          width 60px
          text-align right

          &:hover
            color $color-theme

        &:after
          content ''
          clear both
          display block
</style>
