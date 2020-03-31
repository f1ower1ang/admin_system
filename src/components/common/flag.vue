<template>
  <div class="flag" :class="{active, center: item.flag === undefined}" :title="item.name">
    <el-image :src="item.flag" lazy fits="fill" v-if="item.flag !== undefined">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline-round"></i>
      </div>
    </el-image>
    <span>{{ item.name }}<i :class="item.icon" v-if="item.icon"></i></span>
  </div>
</template>

<script>
export default {
  name: 'flag',
  props: {
    item: {
      type: Object,
      default() {
        return {
          flag: '',
          name: ''
        }
      }
    },
    active: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../assets/stylus/mixin.styl"
  .flag
    line-height 26px
    height 26px
    display flex
    align-items center
    padding 0 5px
    font-size $font-size-medium
    border 1px solid #DADADA
    width 90px
    transition all .3s
    flex-shrink: 0
    &.center
      justify-content center
      span
        text-align center
    .el-image
      height 15px
      width 15px
      border-radius 50%
      line-height 15px
      margin-top -1px
    span
      padding-left 5px
      flex 1
      no-wrap()
    &:hover
      border-color $color-theme
      cursor pointer
    &.active
      background $color-theme
      border none
      color #fff
</style>
