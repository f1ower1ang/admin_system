<template>
  <ul class="device">
    <li class="btn" :class="{active: active === 1}" @click="select(1)">
      <i class="el-icon-s-platform" />
      电脑
    </li>
    <li class="btn" :class="{active: active === 2}" @click="select(2)">
      <i class="el-icon-mobile-phone" />
      移动
    </li>
  </ul>
</template>

<script>
export default {
  name: 'device',
  data() {
    return {
      active: 1,
      devices: ['PC', '移动']
    }
  },
  methods: {
    select(index) {
      this.active = index
      this.$emit('select', this.devices[index - 1])
    }
  }
}
</script>

<style scoped lang="stylus">
.device
  width 100%
  height 100%
  position relative
  padding 10px 0
  background inherit
  .btn
    margin-left 5px
    font-size $font-size-medium
    width calc(100% - 5px)
    padding 10px 10px
    color $color-text-l
    cursor pointer
    word-wrap: break-word
  &:after
    position: absolute;
    content ''
    height 100%
    width 1px
    right 0
    top 0
    background $color-theme
  .active
    border 1px solid $color-theme
    position relative
    color $color-theme
    &:after
      content ''
      position absolute
      height 100%
      width 1px
      right -1px
      top 0
      background #fff
      z-index 10
</style>
