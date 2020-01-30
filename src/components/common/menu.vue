<template>
  <el-menu
    background-color="transparent"
    :collapse="isCollapse"
  >
    <router-link to="/home">
      <el-menu-item>
        <i class="el-icon-house"></i>
        <span slot="title">敌情态势</span>
      </el-menu-item>
    </router-link>
    <el-submenu index="1">
      <template slot="title">
        <router-link to="/aptList">
          <i class="el-icon-tickets"></i>
          <span>背景调研</span>
        </router-link>
      </template>

      <el-menu-item-group>
        <router-link to="/report">
          <el-menu-item>情报一键查</el-menu-item>
        </router-link>
        <router-link to="/aptList">
          <el-menu-item>敌情百科</el-menu-item>
        </router-link>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <router-link to="/search">
          <i class="el-icon-search"></i>
          <span>线索关联</span>
        </router-link>
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
    <router-link to="/reportList">
      <el-menu-item>
        <i class="el-icon-reading"></i>
        <span slot="title">威胁情报</span>
      </el-menu-item>
    </router-link>
  </el-menu>
</template>

<script>
export default {
  name: 'menu',
  props: {
    isCollapse: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="stylus">
  .el-menu
    border none

    .el-menu-item
      color #fff

    .router-link-exact-active
      color rgb(255, 200, 105)
      span
        color rgb(255, 200, 105)
      i
        color inherit
      .el-menu-item
        color rgb(255, 200, 105)

        i
          color inherit
  span
    color #fff
</style>
