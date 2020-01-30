<template>
  <transition name="fade">
    <div class="description" v-show="flag" :style="myStyle" @mouseenter="cancelHidden(true)" @mouseleave="cancelHidden(false)">
      <i class="cancel" @click="hidden">&times;</i>
      <div class="content">
        {{ detail }}
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'description',
  props: {
    myStyle: {
      type: String,
      default: ''
    },
    detail: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      flag: false
    }
  },
  methods: {
    show() {
      this.flag = true
    },
    hidden() {
      this.flag = false
    },
    cancelHidden(flag) {
      this.$emit('cancel', flag)
    }
  }
}
</script>

<style scoped lang="stylus">
.description
  position fixed
  width 400px;
  padding 10px
  font-size 14px
  background #fff
  box-shadow 1px 0 1px 1px #ccc
  .cancel
    cursor pointer
    position absolute
    display block
    right -10px
    top -10px
    width 20px
    height 20px
    border-radius 50%
    line-height 20px
    text-align center
    background #ccc
  .content
    overflow-y auto
    overflow-x hidden
    width 100%
    max-height 250px;
    line-height 30px
  &.fade-enter-active, &.fade-leave-active
    transition all .3s
  &.fade-enter, &.fade-leave-to
    opacity 0
</style>
