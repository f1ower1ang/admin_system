<template>
  <div id="app" style="height: 100%">
    <el-container>
      <el-header>
        <p class="title">网络敌情综合跟踪系统</p>
        <el-popover
          placement="top-end"
          trigger="hover">
          <div class="user-wrapper" slot="reference">
            <span class="username">{{ user }}</span>
            <el-avatar shape="circle" :size="40" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
          </div>
          <p class="item" style="text-align: center; line-height: 30px; border-bottom: 1px solid #eee">个人信息</p>
          <p class="item" style="text-align: center; line-height: 30px;" @click="logout">退出登录</p>
        </el-popover>
      </el-header>
      <el-container>
        <div class="aside" :class="collapse ? 'shrink': 'expand'">
          <Menu :is-collapse="collapse"></Menu>
          <el-button type="warning" :icon="icon" circle @click.native="toggle"></el-button>
        </div>
        <el-main :class="collapse ? 'shrink': 'expand'">
          <keep-alive exclude="Map">
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { logout } from './api/user'
import Menu from './components/common/menu'
export default {
  name: 'app',
  components: {
    Menu
  },
  data() {
    return {
      user: sessionStorage.user,
      collapse: false,
      icon: 'el-icon-arrow-left'
    }
  },
  methods: {
    logout() {
      logout().then((res) => {
        sessionStorage.token = ''
        this.$router.push('/login')
      })
    },
    toggle() {
      this.collapse = !this.collapse
      if (this.collapse) {
        this.icon = 'el-icon-arrow-right'
      } else {
        this.icon = 'el-icon-arrow-left'
      }
    }
  },
  watch: {
    $route(to, from) {
      if (from.path === '/login') {
        this.user = sessionStorage.user
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "assets/stylus/variable.styl"
  .el-container
    height 100%
  .el-header
    position fixed
    line-height: 60px;
    width 100%
    z-index 10
    top 0
    display flex
    justify-content space-between
    background #072040
    border-bottom 1px solid #f0f0f0
    color #f0f0f0
    .title
      font-size $font-size-large-x
    .user-wrapper
      display flex
      align-items center
      .username
        padding-right 10px
        font-size $font-size-medium-x

  .aside
    position fixed
    top 60px
    bottom 0
    color: #fff;
    background #072040
    border-right 1px solid rgba(255, 255, 255, .5)
    transition all .4s
    &.expand
      width 200px
    &.shrink
      width 65px
  .el-main
    margin-top 60px
    height calc(100% - 60px)
    position relative
    transition all .4s
    &.expand
      margin-left 200px
    &.shrink
      margin-left 65px
  .el-button
    transition margin .4s
    float right
    margin-right 20px
    &.is-circle
      padding 6px
</style>
