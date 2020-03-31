<template>
  <el-menu
    background-color="#242443"
    :collapse="isCollapse"
  >
    <router-link to="/home">
      <el-menu-item>
        <i class="el-icon-house"/>
        <span slot="title">敌情态势</span>
      </el-menu-item>
    </router-link>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-search"/>
        <span>线索关联</span>
      </template>

      <el-menu-item-group>
        <router-link to="/ioc">
          <el-menu-item>IOC关联</el-menu-item>
        </router-link>
        <router-link to="/ttp">
          <el-menu-item>TTP关联</el-menu-item>
        </router-link>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <i class="el-icon-tickets"/>
        <span>背景调研</span>
      </template>

      <el-menu-item-group>
        <router-link to="/report">
          <el-menu-item>情报一键查</el-menu-item>
        </router-link>
        <router-link to="/knowledge" :class="active">
          <el-menu-item>敌情百科</el-menu-item>
        </router-link>
      </el-menu-item-group>
    </el-submenu>
    <router-link to="/threatIntelligence">
      <el-menu-item>
        <i class="el-icon-reading"/>
        <span slot="title">威胁情报</span>
      </el-menu-item>
    </router-link>
  </el-menu>
</template>

<script>
export default {
  name: 'sidebar',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: ''
    }
  },
  created () {
    const cur = this.$route
    if (cur.path === '/aptList' || cur.path.indexOf('/detail') > -1) {
      this.active = 'router-link-exact-active'
    }
  },
  watch: {
    $route(cur) {
      if (cur.path === '/aptList' || cur.path.indexOf('/detail') > -1) {
        this.active = 'router-link-exact-active'
      } else {
        this.active = ''
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  .el-menu
    margin-top 35px
    border none
    .el-menu-item
      line-height 40px
      height 40px

    .router-link-exact-active, .router-link-active

      .el-menu-item
        color #fff
        background $color-theme!important
        i, span
          color #fff
  span
    color #fff
</style>
