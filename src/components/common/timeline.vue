<template>
<div class="timeline">
  <div class="item" v-for="(item, index) in items" :key="index">
    <div class="head">
      <div class="line"></div>
      <div class="icon" :class="{ active: current === item}" @click.stop="handleDot(item)"></div>
    </div>
    <div class="main">
      {{ item }}
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'timeline',
  props: {
    items: {
      type: Array,
      default: null
    },
    active: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      current: this.items && this.items.length > 0 ? this.items[this.active] : ''
    }
  },
  watch: {
    items: {
      handler() {
        if (this.items.length > 0) {
          this.current = this.items[0]
        }
      },
      deep: true
    },
    active() {
      this.current = this.items && this.items.length > 0 ? this.items[this.active] : ''
    }
  },
  methods: {
    handleDot(item) {
      this.current = item
      this.$emit('select', item)
    }
  }
}
</script>

<style scoped lang="stylus">
.timeline
  white-space nowrap
  display flex
  font-size 12px
  .item
    flex 1
    position relative
    &:last-child
      flex-grow 0
      flex-shrink 0
      .line
        display none
    .head
      position relative
      width 100%
      border-color #C0C4CC
      color #C0C4CC
      .line
        height 2px
        background-color #C0C4CC
        border-color inherit
        position absolute
        left 0
        right 0
        top 50%
        transform translateY(-50%)
      .icon
        border-radius 50%
        position relative
        border 2px solid
        border-color inherit
        z-index 1
        background #fff
        width 12px
        height 12px
        transition all .2s
        &.active
          background #C0C4CC
    .main
      text-align left
      color #C0C4CC
</style>
