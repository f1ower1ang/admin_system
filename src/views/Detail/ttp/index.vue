<template>
  <div class="ttp-layout">
    <ul class="tabs">
      <router-link class="item" v-for="(item, index) in routes" :key="index" :to="item.route" tag="li">{{ item.title }}</router-link>
    </ul>
    <div class="ttp">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailTtp',
  data() {
    return {
      routes: [
        {
          route: '/detail/ttp/strategy',
          title: '战术环节图谱',
          name: '1'
        }, {
          route: '/detail/ttp/technique',
          title: '技术能力图谱',
          name: '2'
        }, {
          route: '/detail/ttp/process',
          title: '过程细节图谱',
          name: '3'
        }]
    }
  },
  mounted () {
    this.routes.forEach((item) => {
      item.route += '?name=' + this.$route.query.name
    })
  }
}
</script>

<style scoped lang="stylus">
  .ttp-layout
    width 100%
    height 100%
    position relative
    .tabs
      font-size $font-size-medium
      position: absolute;
      top 0
      height 40px
      left 0
      width 100%
      padding 10px 10px 0 50px
      display flex
      background #fff
      .item
        line-height 30px
        padding 0 10px
        border-top-left-radius 3px
        border-top-right-radius 3px
        color $color-text-l
        cursor pointer
        position relative
      .router-link-exact-active
        border 1px solid $color-theme
        color $color-theme
        border-bottom none
        &:after
          position absolute
          content ''
          width 100%
          left 0
          height 1px
          bottom 0
          background #fff
          z-index 10
      &:after
        position absolute
        content ''
        width 100%
        left 0
        height 1px
        bottom 0
        background $color-theme
    .ttp
      position absolute
      top 40px
      bottom 0
      left 0
      width 100%
</style>
