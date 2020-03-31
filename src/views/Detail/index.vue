<template>
  <div class="detail-layout">
    <ul class="tab">
      <router-link class="item" v-for="(item, index) in routes" :key="index" :to="item.route" tag="li">{{ item.title }}</router-link>
    </ul>
    <div class="detail">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  name: 'layout',
  data() {
    return {
      routes: [{
        route: '/detail/map',
        title: '基本情况',
        name: '0'
      }, {
        route: '/detail/ttp',
        title: '动态行为特征',
        name: '1'
      }, {
        route: '/detail/ioc',
        title: '静态资源特征',
        name: '2'
      }],
      currentIndex: '0'
    }
  },
  mounted () {
    this.routes.forEach((item) => {
      item.route += '?name=' + this.$route.query.name
    })
  },
  watch: {
    currentIndex(cur) {
      this.$router.push(this.routes[cur].route)
    }
  }
}
</script>

<style scoped lang="stylus">
.detail-layout
  width 100%
  height 100%
  position relative
  .tab
    font-size $font-size-medium
    position: absolute;
    top 0
    height 40px
    left 0
    width 100%
    padding 10px 10px 0 10px
    background $color-theme
    display flex
    .item
      margin-right 10px
      line-height 30px
      padding 0 5px
      border-top-left-radius 3px
      border-top-right-radius 3px
      color #fff
      cursor pointer
    .router-link-active
      color $color-theme
      background #fff
  .detail
    position absolute
    top 40px
    bottom 0
    left 0
    width 100%
    background #fff
</style>
