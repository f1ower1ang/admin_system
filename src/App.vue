<template>
  <div id="app" style="height: 100%">
    <el-container>
      <el-header>
        <p class="title">网络敌情综合跟踪系统</p>
        <div class="user-wrapper">
          <el-avatar
            shape="circle" :size="40"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          <el-dropdown style="padding-left: 15px" trigger="click" @command="handleCommand">
              <span style="color: #eee">
                {{ user }}<i class="el-icon-arrow-down el-icon--right" />
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <div class="aside" :class="collapse ? 'shrink': 'expand'">
          <sidebar :is-collapse="collapse" />
          <div @click="toggle" class="btn">
            <i class="el-icon-caret-left" :class="{rotate: collapse}"></i>
          </div>
        </div>
        <el-main :class="collapse ? 'shrink': 'expand'">
          <keep-alive :exclude="['layout', 'InspectIoc', 'InspectTtp', 'TtpResult', 'ReportResult', 'IocResult']">
            <router-view />
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { logout } from './api/user'
import sidebar from './components/common/sidebar'

export default {
  name: 'app',
  components: {
    sidebar
  },
  data () {
    return {
      user: sessionStorage.user,
      collapse: false,
      icon: 'el-icon-arrow-left'
    }
  },
  methods: {
    handleCommand (e) {
      if (e === 'logout') {
        logout().then((res) => {
          sessionStorage.token = ''
          this.$router.push('/login')
        })
      }
    },
    toggle () {
      this.collapse = !this.collapse
      if (this.collapse) {
        this.icon = 'el-icon-arrow-right'
      } else {
        this.icon = 'el-icon-arrow-left'
      }
    }
  },
  watch: {
    $route (to, from) {
      if (from.path === '/login') {
        this.user = sessionStorage.user
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
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
    background $color-background-d
    border-bottom 5px solid $color-border
    color #f0f0f0

    .title
      font-size $font-size-large-x

    .user-wrapper
      display flex
      align-items center

      .username
        padding-left 10px
        font-size $font-size-medium-x

  .aside
    position fixed
    top 60px
    bottom 0
    color: #fff;
    background $color-background-d
    border-right 8px solid $color-border
    transition all .4s
    .btn
      position absolute
      right -8px
      width 16px
      top 0
      height 100%
      cursor pointer
      background linear-gradient($color-border, #242443 50%, $color-border)
      display flex
      align-items center
      i
        transition all .4s
      .rotate
        transform rotateY(180deg)

    &.expand
      width 180px

    &.shrink
      width 65px

  .el-main
    margin-top 60px
    height calc(100% - 60px)
    position relative
    transition all .4s
    padding: 0
    background #fff

    &.expand
      margin-left 180px

    &.shrink
      margin-left 65px

  .el-button
    transition margin .4s
    float right
    margin-right 20px

    &.is-circle
      padding 6px
</style>
