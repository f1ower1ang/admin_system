<template>
  <div class="knowledge-page">
    <div class="header">
      <p class="item" @click="changeSort('default', null)">
        <span :class="{active: type.name === 'default'}">默认</span>
      </p>
      <p class="item" @click="changeSort(item.type, null)" v-for="(item, index) in sortList" :key="index">
        <span :class="{active: type.name === item.type}">{{item.name}}</span>
        <span class="icon">
          <i class="el-icon-caret-top" :class="{active: sortType[item.type] === 1}"/>
          <i class="el-icon-caret-bottom" :class="{active: sortType[item.type] === 2}"/>
        </span>
      </p>
    </div>
    <div class="content" id="knowledge">
      <el-row :gutter="20">
        <el-col :span="4" v-for="(country, index) in countryList" :key="index">
          <div class="item" @click.stop="goTo(country, 'aptList')">
            <div class="top">
              <span>{{country.initiator}}</span>
              <el-image :src="country.initiatorFlag">
                <div slot="error" style="text-align: right; font-size: 24px; line-height: 47px">
                  <i class="el-icon-picture-outline"/>
                </div>
              </el-image>
            </div>
            <div class="bottom">
              <div class="left">
                <p class="title">组织</p>
                <p>{{country.aptCount}}</p>
              </div>
              <div class="right" @click.stop="goTo(country, 'reportList')">
                <p class="title">报告</p>
                <p>{{country.reportCount}}</p>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getCountry } from '../../api/home'
import { Loading } from 'element-ui'

const ACTION = {
  0: null,
  1: 'asc',
  2: 'desc'
}
export default {
  name: 'index',
  data () {
    return {
      sortList: [
        {
          name: '名称',
          type: 'initiator'
        }, {
          name: '组织',
          type: 'aptCount'
        }, {
          name: '报告',
          type: 'reportCount'
        }],
      type: {
        name: 'default',
        action: ''
      },
      sortType: {
        initiator: 0,
        aptCount: 0,
        reportCount: 0
      },
      sort: '',
      limit: 18,
      page: 1,
      total: 0,
      countryList: []
    }
  },
  created () {
    this.getCountries()
  },
  watch: {
    type: {
      handler (cur) {
        this.page = 1
        if (cur.action) {
          this.sort = `${cur.name} ${cur.action}`
          this.getCountries()
        } else {
          this.sort = ''
          this.getCountries()
        }
      },
      deep: true
    }
  },
  methods: {
    goTo(item, type) {
      this.$router.push(`/${type}?country=${item.initiator}`)
    },
    changeSort (name, action) {
      if (name !== 'default') {
        this.sortType[name] = (this.sortType[name] + 1) % 3
        action = ACTION[this.sortType[name]]
      }
      this.type = { name, action }
    },
    async getCountries () {
      this.startLoading()
      setTimeout(async () => {
        const res = await getCountry({ orderBy: this.sort })
        this.countryList = res.data
        this.endLoading()
      }, 200)
    },
    startLoading () {
      this.loading = Loading.service({
        lock: true,
        target: '#knowledge'
      })
    },
    endLoading () {
      this.loading && this.loading.close()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/mixin.styl"
  .knowledge-page
    background $color-background
    width 100%
    height 100%
    position relative

    .header
      line-height 60px
      padding 0 20px
      display flex
      align-items center
      background #fff
      font-size $font-size-medium
      color $color-text-l

      .item
        display flex
        transition all .3s
        cursor pointer
        margin-right 40px
        align-items center

        .icon
          display flex
          flex-direction column
          justify-content center

          .el-icon-caret-top
            margin-bottom -3px

          .el-icon-caret-bottom
            margin-top -3px

      .active
        color $color-theme

    .content
      background $color-background
      padding 40px 20px

      .item
        background #fff
        margin-bottom 20px
        box-shadow: 0 0 6px 0 rgba(223, 223, 223, 1);
        border: 1px solid rgba(217, 217, 217, 1);
        border-radius: 4px;
        padding 10px
        font-size $font-size-medium
        cursor pointer

        .top
          display flex
          align-items center
          font-weight bold
          justify-content space-between

          span
            no-wrap()
            font-size $font-size-large

          .el-image
            width: 74px;
            height: 47px;

        .bottom
          display flex
          align-items center
          margin-top 30px
          justify-content space-between

          p
            text-align center
            font-weight bold
            font-size $font-size-large

          .title
            font-size $font-size-small
            color $color-text-l
            font-weight normal

</style>
