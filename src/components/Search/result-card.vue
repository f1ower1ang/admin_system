<template>
  <div class="card" @click="select(item)" :class="{border}">
    <div class="left">
      <el-image :src="item.imgUrl" style="height: 100%; width: 100%">
      </el-image>
    </div>
    <div class="right">
      <div class="top">
        <div class="text">
          <h2 class="title" v-html="item.title"/>
          <span class="tag apt" v-if="item.apt" @click.stop="searchReport(item.apt)">{{ item.apt }}</span>
          <flag class="tag" :item="item.item" @click.native.stop="goTo(item.item.name, '/reportList?country=')" v-if="item.item"/>
        </div>
        <div class="btn" v-if="item.hash">
          <el-button type="text" @click.native.stop="goTo(item.hash, '/threatIntelligence/ttp?hash=')">查看TTP</el-button>
          <el-button type="text" @click.native.stop="goTo(item.hash, '/threatIntelligence/ioc?hash=')">查看IOC资源</el-button>
        </div>
      </div>
      <div class="middle">
        <p v-if="item.fileName" v-html="item.fileName" class="filename" />
        <p v-if="item.statement" v-html="item.statement" class="statement" />
      </div>
      <div class="bottom">
        <p class="date" v-if="item.date">
          发布日期：{{ item.date }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import flag from '../common/flag'

export default {
  name: 'result-card',
  components: { flag },
  props: {
    item: {
      type: Object,
      default: null
    },
    locate: {
      type: String,
      default: 'true'
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    select (item) {
      this.$emit('select', item)
      if (item.url) {
        open(item.url)
      } else {
        this.$router.push(`/detail?name=${item.apt}`)
      }
    },
    goTo(query, path) {
      let routerHref = this.$router.resolve({
        path: path + query
      })
      open(routerHref.href)
    },
    searchReport(keywords) {
      this.$emit('search', keywords)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/mixin.styl"
  .card
    display flex
    align-items center
    width 100%
    height 156px
    overflow hidden
    cursor pointer
    padding 10px 0
    &.border
      border-top 1px solid #E6E6E6

    .left
      width 206px
      height 136px
      flex-shrink 0

    .right
      display flex
      flex-direction column
      flex 1
      padding-left 20px
      height 100%
      overflow hidden
      justify-content space-between

      .top
        width 100%
        overflow hidden
        display flex
        align-items center

        .text
          flex 1
          display flex
          padding-right 10px
          overflow hidden

          .title
            font-size $font-size-large
            no-wrap()
          .tag
            margin-left 10px
            background $color-theme-d
            border none
            width 90px
            color $color-theme
            font-size $font-size-medium
            &:hover
              cursor default
              border none
          .apt
            text-align center
            line-height 26px
            width 90px

        .btn
          flex-shrink 0
          width 150px

      .middle
        .filename
          font-size $font-size-medium
          color $color-text-l
          no-wrap()
          line-height 20px
          height 20px
        .statement
          line-height: 20px;
          height 40px
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;

      .bottom
        .date
          color $color-text-l
          font-size $font-size-medium
</style>
